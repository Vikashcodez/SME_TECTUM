import express from 'express';
import { login, register } from '../controllers/auth.Controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import pool from '../config/database.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/login', login);
authRouter.post('/register', register);

// Protected route example - Get all users (only admin and manager can access)
authRouter.get('/users', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.user_id, u.employee_name, u.email, u.role, u.is_active, u.created_at,
                   s.company_name
            FROM users u
            JOIN summary s ON u.company_id = s.company_id
            ORDER BY u.created_at DESC
        `);
        
        res.status(200).json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get companies (protected)
authRouter.get('/companies', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM summary ORDER BY company_id');
        
        res.status(200).json({
            success: true,
            count: result.rows.length,
            companies: result.rows
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get current user profile (protected)
authRouter.get('/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.user_id, u.employee_name, u.email, u.role, u.company_id, u.is_active,
                   s.company_name, s.industry, s.location
            FROM users u
            JOIN summary s ON u.company_id = s.company_id
            WHERE u.email = $1
        `, [req.user.email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

export default authRouter;