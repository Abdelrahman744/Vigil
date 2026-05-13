import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { signupSchema, loginSchema } from '../validators/auth.validator.js';

const router = express.Router();

// Rate limiters to prevent brute-force and signup spam
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 10,                      // 10 login attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'Too many login attempts, please try again after 15 minutes' }
});

const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,    // 1 hour
    max: 5,                       // 5 signups per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'Too many accounts created, please try again after an hour' }
});

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
router.post('/signup', signupLimiter, validate(signupSchema), signup);

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
router.post('/login', loginLimiter, validate(loginSchema), login);

export default router;
