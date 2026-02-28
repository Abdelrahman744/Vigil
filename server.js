import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';
import monitorRoutes from './routes/monitor.routes.js'; 




dotenv.config();


const app = express(); 


connectDB();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));




app.use('/api', monitorRoutes);

app.get('/', (req, res) => {
    res.send('Vigil API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});