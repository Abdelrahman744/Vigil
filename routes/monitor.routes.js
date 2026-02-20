import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { pingWebsite,getAllLogs,clearLogs,addTarget,getTargets,deleteTarget,toggleTarget,getTargetStats } from '../controllers/monitor.controller.js';
import { runHeartbeat } from '../services/monitor.service.js';
import { autoCleanup } from '../controllers/monitor.controller.js';

const router = express.Router();


// Public Auth Routes
router.post('/signup', signup);
router.post('/login', login);

router.get('/cron/heartbeat', async (req, res) => {
    const authHeader = req.headers['x-api-key'];
    
    if (authHeader !== process.env.CRON_SECRET) {
        return res.status(401).send('Unauthorized');
    }

    try {
        await runHeartbeat();
        res.status(200).send('Heartbeat completed');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

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



router.get('/cron/cleanup', async (req, res) => {
    await autoCleanup();
    res.status(200).send('Cleanup completed');
});

export default router;