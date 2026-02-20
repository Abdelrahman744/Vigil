import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { pingWebsite,getAllLogs,clearLogs,addTarget,getTargets,deleteTarget,toggleTarget,getTargetStats } from '../controllers/monitor.controller.js';

const router = express.Router();


// Public Auth Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Monitoring Routes
router.use(protect);


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