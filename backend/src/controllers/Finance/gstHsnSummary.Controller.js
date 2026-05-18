import pool from '../../config/database.js';

const TABLE = 'gst_hsn_summary';
const PK = 'hsn_id';

export const createGstHsn = async (req, res) => {
    try {
        const body = req.body || {};
        const keys = Object.keys(body);
        if (keys.length === 0) return res.status(400).json({ success: false, message: 'No data provided' });
        const cols = keys.join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const values = keys.map((k) => body[k]);
        const query = `INSERT INTO ${TABLE} (${cols}) VALUES (${placeholders}) RETURNING *`;
        const result = await pool.query(query, values);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating gst hsn summary:', error);
        res.status(500).json({ success: false, message: 'Error creating record', error: error.message });
    }
};

export const getAllGstHsn = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM ${TABLE} ORDER BY ${PK} DESC`);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching gst hsn summary:', error);
        res.status(500).json({ success: false, message: 'Error fetching records', error: error.message });
    }
};

export const getGstHsnById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = $1`, [id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching gst hsn by id:', error);
        res.status(500).json({ success: false, message: 'Error fetching record', error: error.message });
    }
};

export const updateGstHsn = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};
        const keys = Object.keys(body);
        if (keys.length === 0) return res.status(400).json({ success: false, message: 'No update fields provided' });
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = keys.map((k) => body[k]);
        values.push(id);
        const query = `UPDATE ${TABLE} SET ${setClause} WHERE ${PK} = $${values.length} RETURNING *`;
        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating gst hsn:', error);
        res.status(500).json({ success: false, message: 'Error updating record', error: error.message });
    }
};

export const deleteGstHsn = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error deleting gst hsn:', error);
        res.status(500).json({ success: false, message: 'Error deleting record', error: error.message });
    }
};
