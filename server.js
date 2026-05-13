import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import setupSwagger from './config/swagger.js';
import { sanitizeBody } from './middlewares/sanitize.middleware.js';
import authRoutes from './routes/auth.routes.js';
import monitorRoutes from './routes/monitor.routes.js';
import targetRoutes from './routes/target.routes.js';
import cronRoutes from './routes/cron.routes.js';

dotenv.config();

const app = express();

connectDB();

// Global rate limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'Too many requests, please try again later' }
});

app.use(express.json());
app.use(sanitizeBody);
app.use(morgan('dev'));

setupSwagger(app);

app.use('/api', apiLimiter);
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