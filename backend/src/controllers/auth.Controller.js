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

        // Check for admin login - ONLY .env credentials get isAdmin: true
        const adminEmail = process.env.ADMIN_EMAIL?.trim();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();
        
        console.log('Attempting login with email:', email);
        console.log('Super admin email from .env:', adminEmail);
        
        // SUPER ADMIN FROM .ENV ONLY
        if (email === adminEmail && password === adminPassword) {
            console.log('✓ SUPER ADMIN LOGIN SUCCESSFUL');
            const token = jwt.sign(
                { 
                    email: email,
                    role: 'super_admin',
                    isAdmin: true 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            return res.status(200).json({
                success: true,
                message: 'Super Admin login successful',
                token,
                user: {
                    email: email,
                    role: 'super_admin',
                    employee_name: 'Super Admin',
                    isAdmin: true
                }
            });
        }
        
        console.log('Not super admin, checking database...');

        // Check for regular user from database
        const userQuery = `
            SELECT u.*, c.company_name, c.industry, c.location 
            FROM users u
            JOIN company c ON u.company_id = c.company_id
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

        console.log('✓ DATABASE USER LOGIN - isAdmin MUST BE FALSE');
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
                company_name: user.company_name,
                isAdmin: false
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

// Register function - Register company first, then register user
export const register = async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const { 
            company_name, 
            industry, 
            location, 
            year_of_establishment, 
            number_of_employees, 
            installed_capacity,
            employee_name, 
            email, 
            password, 
            role 
        } = req.body;

        // Validate required fields for company and user
        if (!company_name || !employee_name || !email || !password || !role) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: company_name, employee_name, email, password, role'
            });
        }

        // Check if user with email already exists
        const userCheck = await client.query(
            'SELECT email FROM users WHERE email = $1',
            [email]
        );
        
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Insert company
        const companyQuery = `
            INSERT INTO company (company_name, industry, location, year_of_establishment, number_of_employees, installed_capacity)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING company_id, company_name, industry, location
        `;
        
        const companyResult = await client.query(companyQuery, [
            company_name,
            industry || null,
            location || null,
            year_of_establishment || null,
            number_of_employees || null,
            installed_capacity || null
        ]);
        
        const company = companyResult.rows[0];

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user with the registered company
        const userQuery = `
            INSERT INTO users (company_id, employee_name, email, password_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, company_id, employee_name, email, role, created_at
        `;
        
        const userResult = await client.query(userQuery, [
            company.company_id, 
            employee_name, 
            email, 
            hashedPassword, 
            role
        ]);
        
        const newUser = userResult.rows[0];

        await client.query('COMMIT');

        // Generate token for the newly registered user
        const token = generateToken(newUser);

        console.log('✓ NEW USER REGISTERED - isAdmin MUST BE FALSE');
        res.status(201).json({
            success: true,
            message: 'Company and user registered successfully',
            token,
            user: {
                id: newUser.user_id,
                name: newUser.employee_name,
                email: newUser.email,
                role: newUser.role,
                company_id: newUser.company_id,
                company_name: company.company_name,
                company_info: company,
                isAdmin: false
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    } finally {
        client.release();
    }
};