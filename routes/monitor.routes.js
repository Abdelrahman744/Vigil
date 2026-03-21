import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { pingWebsite, getAllLogs, clearLogs, addTarget, getTargets,deleteAllTargets, deleteTarget, toggleTarget, getTargetStats, autoCleanup } from '../controllers/monitor.controller.js';
import { runHeartbeat } from '../services/monitor.service.js';
import { validate, signupSchema, loginSchema, addTargetSchema, pingWebsiteSchema } from '../middlewares/validate.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/signup', validate(signupSchema), signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate and receive a JWT Bearer Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/login', validate(loginSchema), login);

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

// Protected Monitoring Routes
router.use(protect);

/**
 * @swagger
 * /ping:
 *   post:
 *     summary: Manually check a URL once
 *     tags: [Monitor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ping Successful
 */
router.post('/ping', validate(pingWebsiteSchema), pingWebsite);

/**
 * @swagger
 * /all:
 *   get:
 *     summary: View all historical ping logs
 *     tags: [Monitor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of logs
 */
router.get('/all', getAllLogs);

/**
 * @swagger
 * /clear:
 *   delete:
 *     summary: Wipe all logs from the database
 *     tags: [Monitor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleared
 */
router.delete('/clear', clearLogs);

/**
 * @swagger
 * /targets:
 *   post:
 *     summary: Add a new URL to monitor
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url, name]
 *             properties:
 *               url:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Target added
 *   get:
 *     summary: List all monitored websites
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of targets
 */
router.post('/targets', validate(addTargetSchema), addTarget);
router.get('/targets', getTargets);

/**
 * @swagger
 * /targets/{id}:
 *   delete:
 *     summary: Remove a target
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Target deleted
 */
router.delete('/targets/:id', deleteTarget);

/**
 * @swagger
 * /targets:
 * delete:
 * summary: Remove ALL monitored targets for the user
 * tags: [Target]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: All targets and logs deleted successfully
 */
router.delete('/targets', deleteAllTargets);

/**
 * @swagger
 * /targets/{id}/toggle:
 *   patch:
 *     summary: Pause or Resume monitoring for a specific target
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Toggled successfully
 */
router.patch('/targets/:id/toggle', toggleTarget);

/**
 * @swagger
 * /targets/{id}/stats:
 *   get:
 *     summary: View Uptime % and average latency stats
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stats retrieved
 */
router.get('/targets/:id/stats', getTargetStats);

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