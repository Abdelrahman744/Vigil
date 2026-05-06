import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { pingWebsiteSchema } from '../validators/monitor.validator.js';
import { pingWebsite, getAllLogs, clearLogs } from '../controllers/monitor.controller.js';

const router = express.Router();

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

export default router;