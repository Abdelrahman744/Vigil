import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';
import setupSwagger from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import monitorRoutes from './routes/monitor.routes.js';
import targetRoutes from './routes/target.routes.js';
import cronRoutes from './routes/cron.routes.js';

dotenv.config();

const app = express();

connectDB();

app.use((req, res, next) => {
    // CORS headers are now handled by vercel.json at the edge layer
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
app.use(express.json());
app.use(morgan('dev'));

setupSwagger(app);

app.use('/api', authRoutes);
app.use('/api', monitorRoutes);
app.use('/api', targetRoutes);
app.use('/api', cronRoutes);

app.get('/', (req, res) => {
    res.send('Vigil API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});