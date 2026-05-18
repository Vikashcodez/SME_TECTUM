import pool from '../../config/database.js';

const TABLE = 'monthly_financial_entries';
const PK = 'financial_id';

export const createMonthlyFinancial = async (req, res) => {
    try {
        const body = req.body || {};
        const keys = Object.keys(body);
        if (keys.length === 0) return res.status(400).json({ success: false, message: 'No data provided' });

        const cols = keys.join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const values = keys.map((k) => body[k]);

        const query = `INSERT INTO ${TABLE} (${cols}) VALUES (${placeholders}) RETURNING *`;
        const result = await pool.query(query, values);

        res.status(201).json({ success: true, data: result.rows[0], message: 'Monthly financial entry created' });
    } catch (error) {
        console.error('Error creating monthly financial entry:', error);
        res.status(500).json({ success: false, message: 'Error creating entry', error: error.message });
    }
};

export const getAllMonthlyFinancial = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM ${TABLE} ORDER BY ${PK} DESC`);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching monthly financial entries:', error);
        res.status(500).json({ success: false, message: 'Error fetching entries', error: error.message });
    }
};

export const getMonthlyFinancialById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = $1`, [id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching monthly financial entry:', error);
        res.status(500).json({ success: false, message: 'Error fetching entry', error: error.message });
    }
};

export const updateMonthlyFinancial = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};
        const keys = Object.keys(body);
        if (keys.length === 0) return res.status(400).json({ success: false, message: 'No update fields provided' });

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = keys.map((k) => body[k]);
        values.push(id);

        const query = `UPDATE ${TABLE} SET ${setClause}, created_at = COALESCE(created_at, CURRENT_TIMESTAMP) WHERE ${PK} = $${values.length} RETURNING *`;
        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

        res.status(200).json({ success: true, data: result.rows[0], message: 'Updated successfully' });
    } catch (error) {
        console.error('Error updating monthly financial entry:', error);
        res.status(500).json({ success: false, message: 'Error updating entry', error: error.message });
    }
};

export const deleteMonthlyFinancial = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: result.rows[0], message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting monthly financial entry:', error);
        res.status(500).json({ success: false, message: 'Error deleting entry', error: error.message });
    }
};
