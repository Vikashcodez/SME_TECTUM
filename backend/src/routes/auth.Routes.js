import express from 'express';
import { login, register } from '../controllers/auth.Controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import pool from '../config/database.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/login', login);
authRouter.post('/register', register);

export default authRouter;