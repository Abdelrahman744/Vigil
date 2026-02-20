import express from 'express';
import { pingWebsite,getAllLogs,clearLogs,addTarget,getTargets,deleteTarget,toggleTarget,getTargetStats } from '../controllers/monitor.controller.js';

const router = express.Router();


router.post('/ping', pingWebsite);
router.get('/all', getAllLogs);
router.delete('/clear', clearLogs)

// target routes 

router.post('/targets', addTarget);
router.get('/targets',getTargets);
router.delete('/targets/:id', deleteTarget);
router.patch('/targets/:id/toggle', toggleTarget);
router.get('/targets/:id/stats', getTargetStats);

export default router;