import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import monitorRoutes from './routes/monitor.routes.js'; // Import your routes

dotenv.config();

// 1. INITIALIZE app first!
const app = express(); 

// 2. CONNECT to DB
connectDB();

// 3. MIDDLEWARES
app.use(express.json());
app.use(morgan('dev'));

// 4. ROUTES (Now 'app' exists, so this won't crash)
app.use('/api', monitorRoutes);


app.get('/', (req, res) => {
    res.send('Vigil API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});