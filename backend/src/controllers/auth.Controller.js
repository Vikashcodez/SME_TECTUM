import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.user_id, 
            email: user.email, 
            role: user.role,
            company_id: user.company_id 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Admin from .env
const getAdminFromEnv = () => ({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
    employee_name: 'Super Admin'
});

// Login function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for admin login
        const adminUser = getAdminFromEnv();
        if (email === adminUser.email) {
            if (password === adminUser.password) {
                const token = jwt.sign(
                    { 
                        email: adminUser.email, 
                        role: 'admin',
                        isAdmin: true 
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRE }
                );

                return res.status(200).json({
                    success: true,
                    message: 'Admin login successful',
                    token,
                    user: {
                        email: adminUser.email,
                        role: 'admin',
                        employee_name: adminUser.employee_name
                    }
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        }

        // Check for regular user from database
        const userQuery = `
            SELECT u.*, s.company_name, s.industry, s.location 
            FROM users u
            JOIN summary s ON u.company_id = s.company_id
            WHERE u.email = $1 AND u.is_active = true
        `;
        const result = await pool.query(userQuery, [email]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials or user not found'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                name: user.employee_name,
                email: user.email,
                role: user.role,
                company_id: user.company_id,
                company_name: user.company_name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Register function
export const register = async (req, res) => {
    try {
        const { company_id, employee_name, email, password, role } = req.body;

        // Validate required fields
        if (!company_id || !employee_name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: company_id, employee_name, email, password, role'
            });
        }

        // Check if company exists
        const companyCheck = await pool.query(
            'SELECT company_id FROM summary WHERE company_id = $1',
            [company_id]
        );
        
        if (companyCheck.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Company does not exist'
            });
        }

        // Check if user already exists
        const userCheck = await pool.query(
            'SELECT email FROM users WHERE email = $1',
            [email]
        );
        
        if (userCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const insertQuery = `
            INSERT INTO users (company_id, employee_name, email, password_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, employee_name, email, role, company_id
        `;
        
        const result = await pool.query(insertQuery, [company_id, employee_name, email, hashedPassword, role]);
        const newUser = result.rows[0];

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};