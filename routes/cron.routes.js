import express from 'express';
import { runHeartbeat } from '../services/monitor.service.js';
import { autoCleanup } from '../controllers/monitor.controller.js';

const router = express.Router();

/**
 * @swagger
 * /cron/heartbeat:
 *   get:
 *     summary: Triggers a monitoring cycle
 *     tags: [Cron]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Heartbeat completed
 */
router.get('/cron/heartbeat', async (req, res) => {
    if (req.headers['x-api-key'] !== process.env.CRON_SECRET) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const result = await runHeartbeat();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /cron/cleanup:
 *   get:
 *     summary: Triggers the 24-hour database log cleanup
 *     tags: [Cron]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Cleanup completed
 */
router.get('/cron/cleanup', async (req, res) => {
    await autoCleanup();
    res.status(200).send('Cleanup completed');
});

export default router;
