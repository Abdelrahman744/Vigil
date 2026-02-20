import express from 'express';
import { pingWebsite,getAllLogs } from '../controllers/monitor.controller.js';

const router = express.Router();

// Define the POST route
router.post('/ping', pingWebsite);

// Add this below your ping route
router.get('/logs', getAllLogs);


export default router;