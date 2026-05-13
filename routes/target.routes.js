import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { sanitizeBody } from '../middlewares/sanitize.middleware.js';
import { addTargetSchema } from '../validators/target.validator.js';
import {
    addTarget,
    getTargets,
    deleteTarget,
    deleteAllTargets,
    toggleTarget,
    getTargetStats
} from '../controllers/monitor.controller.js';

const router = express.Router();

router.use(protect);

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
router.post('/targets', sanitizeBody, validate(addTargetSchema), addTarget);
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
 *   delete:
 *     summary: Delete all targets and their logs
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All targets deleted
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

export default router;
