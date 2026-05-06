import pool from '../config/database.js'; 

// Display all companies
export const getAllCompanies = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.*,
                u.employee_name as updated_by_name
            FROM company c
            LEFT JOIN users u ON c.updated_by = u.user_id
            ORDER BY c.company_id DESC
        `;
        
        const result = await pool.query(query);
        
        res.status(200).json({
            success: true,
            data: result.rows,
            message: 'Companies fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching companies',
            error: error.message
        });
    }
};

// Display single company by ID
export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                c.*,
                u.employee_name as updated_by_name
            FROM company c
            LEFT JOIN users u ON c.updated_by = u.user_id
            WHERE c.company_id = $1
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Company fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching company',
            error: error.message
        });
    }
};

// Edit/Update company
export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            company_name,
            industry,
            location,
            year_of_establishment,
            number_of_employees,
            installed_capacity,
            gst_number,
            pan_number,
            updated_by
        } = req.body;
        
        // Check if company exists
        const checkQuery = 'SELECT company_id FROM company WHERE company_id = $1';
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        
        // Update company
        const updateQuery = `
            UPDATE company 
            SET 
                company_name = COALESCE($1, company_name),
                industry = COALESCE($2, industry),
                location = COALESCE($3, location),
                year_of_establishment = COALESCE($4, year_of_establishment),
                number_of_employees = COALESCE($5, number_of_employees),
                installed_capacity = COALESCE($6, installed_capacity),
                gst_number = COALESCE($7, gst_number),
                pan_number = COALESCE($8, pan_number),
                updated_by = COALESCE($9, updated_by),
                updated_at = CURRENT_TIMESTAMP
            WHERE company_id = $10
            RETURNING *
        `;
        
        const values = [
            company_name,
            industry,
            location,
            year_of_establishment,
            number_of_employees,
            installed_capacity,
            gst_number,
            pan_number,
            updated_by,
            id
        ];
        
        const result = await pool.query(updateQuery, values);
        
        // Fetch updated company with user name
        const finalQuery = `
            SELECT 
                c.*,
                u.employee_name as updated_by_name
            FROM company c
            LEFT JOIN users u ON c.updated_by = u.user_id
            WHERE c.company_id = $1
        `;
        
        const finalResult = await pool.query(finalQuery, [id]);
        
        res.status(200).json({
            success: true,
            data: finalResult.rows[0],
            message: 'Company updated successfully'
        });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating company',
            error: error.message
        });
    }
};

// Partial update (PATCH) - update specific fields only
export const patchCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { updated_by } = updates;
        
        // Check if company exists
        const checkQuery = 'SELECT company_id FROM company WHERE company_id = $1';
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }
        
        // Build dynamic update query
        const allowedFields = [
            'company_name',
            'industry',
            'location',
            'year_of_establishment',
            'number_of_employees',
            'installed_capacity',
            'gst_number',
            'pan_number'
        ];
        
        const updateFields = [];
        const values = [];
        let paramCounter = 1;
        
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                updateFields.push(`${field} = $${paramCounter}`);
                values.push(updates[field]);
                paramCounter++;
            }
        }
        
        if (updated_by !== undefined) {
            updateFields.push(`updated_by = $${paramCounter}`);
            values.push(updated_by);
            paramCounter++;
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }
        
        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        
        const updateQuery = `
            UPDATE company 
            SET ${updateFields.join(', ')}
            WHERE company_id = $${paramCounter}
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, values);
        
        // Fetch updated company with user name
        const finalQuery = `
            SELECT 
                c.*,
                u.employee_name as updated_by_name
            FROM company c
            LEFT JOIN users u ON c.updated_by = u.user_id
            WHERE c.company_id = $1
        `;
        
        const finalResult = await pool.query(finalQuery, [id]);
        
        res.status(200).json({
            success: true,
            data: finalResult.rows[0],
            message: 'Company updated successfully'
        });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating company',
            error: error.message
        });
    }
};

// Search companies with filters
export const searchCompanies = async (req, res) => {
    try {
        const {
            company_name,
            industry,
            location,
            min_employees,
            max_employees,
            min_year,
            max_year
        } = req.query;
        
        let query = `
            SELECT 
                c.*,
                u.employee_name as updated_by_name
            FROM company c
            LEFT JOIN users u ON c.updated_by = u.user_id
            WHERE 1=1
        `;
        
        const values = [];
        let paramCounter = 1;
        
        if (company_name) {
            query += ` AND c.company_name ILIKE $${paramCounter}`;
            values.push(`%${company_name}%`);
            paramCounter++;
        }
        
        if (industry) {
            query += ` AND c.industry ILIKE $${paramCounter}`;
            values.push(`%${industry}%`);
            paramCounter++;
        }
        
        if (location) {
            query += ` AND c.location ILIKE $${paramCounter}`;
            values.push(`%${location}%`);
            paramCounter++;
        }
        
        if (min_employees) {
            query += ` AND c.number_of_employees >= $${paramCounter}`;
            values.push(min_employees);
            paramCounter++;
        }
        
        if (max_employees) {
            query += ` AND c.number_of_employees <= $${paramCounter}`;
            values.push(max_employees);
            paramCounter++;
        }
        
        if (min_year) {
            query += ` AND c.year_of_establishment >= $${paramCounter}`;
            values.push(min_year);
            paramCounter++;
        }
        
        if (max_year) {
            query += ` AND c.year_of_establishment <= $${paramCounter}`;
            values.push(max_year);
            paramCounter++;
        }
        
        query += ` ORDER BY c.company_id DESC`;
        
        const result = await pool.query(query, values);
        
        res.status(200).json({
            success: true,
            data: result.rows,
            count: result.rows.length,
            message: 'Companies fetched successfully'
        });
    } catch (error) {
        console.error('Error searching companies:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching companies',
            error: error.message
        });
    }
};