import express from 'express';
import { pingWebsite,getAllLogs,clearLogs } from '../controllers/monitor.controller.js';

const router = express.Router();

// Define the POST route
router.post('/ping', pingWebsite);

// Add this below your ping route
router.get('/all', getAllLogs);
router.delete('/clear', clearLogs)


export default router;