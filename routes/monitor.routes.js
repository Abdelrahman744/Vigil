import express from 'express';
import { pingWebsite,getAllLogs,clearLogs,addTarget,getTargets,deleteTarget,toggleTarget } from '../controllers/monitor.controller.js';

const router = express.Router();

// Define the POST route
router.post('/ping', pingWebsite);

router.get('/all', getAllLogs);
router.delete('/clear', clearLogs)


router.post('/targets', addTarget);
router.get('/targets',getTargets);
router.delete('/targets/:id', deleteTarget);
router.patch('/targets/:id/toggle', toggleTarget);


export default router;