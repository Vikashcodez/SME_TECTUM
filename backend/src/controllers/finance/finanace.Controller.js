// financials.controller.js
import pool from '../../config/database.js'; // Adjust path to your database connection

// Helper function to handle database errors
const handleDatabaseError = (error, res, message = 'Database error occurred') => {
  console.error('Database error:', error);
  return res.status(500).json({ 
    success: false, 
    message, 
    error: error.message 
  });
};

// Helper function to validate required fields
const validateFinancialData = (data) => {
  const requiredFields = ['company_id', 'fiscal_year', 'month'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  return { isValid: true };
};

// Create new financial record
export const createFinancial = async (req, res) => {
  let client;
  try {
    const financialData = req.body;
    
    // Validate required fields
    const validation = validateFinancialData(financialData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.message 
      });
    }
    
    client = await pool.connect();
    
    // Start transaction
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO financials (
        company_id, fiscal_year, month, status,
        revenue, expenses, cash_balance,
        total_gst_liability, input_tax_credit, monthly_gst_tax_paid,
        recv_not_due, recv_less_30, recv_30_60, recv_60_90, recv_90_180, recv_above_180,
        pay_not_due, pay_less_30, pay_30_60, pay_60_90, pay_90_180, pay_above_180,
        current_assets, current_liabilities, total_debt, wc_utilization_used,
        working_capital_limit, short_term_debt, equity, interest_expense,
        existing_loan_amount, loan_type, emi_amount, interest_rate,
        loan_tenure_months, emi_start_date, loan_security_collateral,
        overdue_amount, credit_score, bank_nbfc_name, emi_delays_last_12_months,
        loan_restructuring_history, rec_from_receivables, paid_for_payables,
        paid_to_employees, other_overheads, income_tax_paid, purchase_of_ppe,
        sale_of_ppe, share_capital_issued, bank_loan_repaid, debentures_redeemed,
        dividends_paid, cash_at_beginning, cash_at_end, avg_monthly_inflows,
        avg_monthly_outflows, months_with_cash_shortage, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34,
        $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
        $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61
      ) RETURNING *
    `;
    
    const values = [
      financialData.company_id, financialData.fiscal_year, financialData.month, 
      financialData.status || 'Draft',
      financialData.revenue || 0, financialData.expenses || 0, 
      financialData.cash_balance || 0,
      financialData.total_gst_liability || 0, financialData.input_tax_credit || 0, 
      financialData.monthly_gst_tax_paid || 0,
      financialData.recv_not_due || 0, financialData.recv_less_30 || 0, 
      financialData.recv_30_60 || 0, financialData.recv_60_90 || 0,
      financialData.recv_90_180 || 0, financialData.recv_above_180 || 0,
      financialData.pay_not_due || 0, financialData.pay_less_30 || 0,
      financialData.pay_30_60 || 0, financialData.pay_60_90 || 0,
      financialData.pay_90_180 || 0, financialData.pay_above_180 || 0,
      financialData.current_assets || 0, financialData.current_liabilities || 0,
      financialData.total_debt || 0, financialData.wc_utilization_used || 0,
      financialData.working_capital_limit || 0, financialData.short_term_debt || 0,
      financialData.equity || 0, financialData.interest_expense || 0,
      financialData.existing_loan_amount || 0, financialData.loan_type || null,
      financialData.emi_amount || 0, financialData.interest_rate || 0,
      financialData.loan_tenure_months || null, financialData.emi_start_date || null,
      financialData.loan_security_collateral || null, financialData.overdue_amount || 0,
      financialData.credit_score || null, financialData.bank_nbfc_name || null,
      financialData.emi_delays_last_12_months || 0, financialData.loan_restructuring_history || null,
      financialData.rec_from_receivables || 0, financialData.paid_for_payables || 0,
      financialData.paid_to_employees || 0, financialData.other_overheads || 0,
      financialData.income_tax_paid || 0, financialData.purchase_of_ppe || 0,
      financialData.sale_of_ppe || 0, financialData.share_capital_issued || 0,
      financialData.bank_loan_repaid || 0, financialData.debentures_redeemed || 0,
      financialData.dividends_paid || 0, financialData.cash_at_beginning || 0,
      financialData.cash_at_end || 0, financialData.avg_monthly_inflows || 0,
      financialData.avg_monthly_outflows || 0, financialData.months_with_cash_shortage || null,
      financialData.created_by || null
    ];
    
    const result = await client.query(query, values);
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Financial record created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    handleDatabaseError(error, res, 'Error creating financial record');
  } finally {
    if (client) client.release();
  }
};

// Get all financial records with pagination and filtering
export const getAllFinancials = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      company_id,
      fiscal_year,
      month,
      status,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        f.*,
        c.company_name as company_name,
        u.employee_name as created_by_name
      FROM financials f
      LEFT JOIN company c ON f.company_id = c.company_id
      LEFT JOIN users u ON f.created_by = u.user_id
      WHERE 1=1
    `;
    const conditions = [];
    const values = [];
    let paramIndex = 1;
    
    if (company_id) {
      conditions.push(`f.company_id = $${paramIndex++}`);
      values.push(company_id);
    }
    if (fiscal_year) {
      conditions.push(`f.fiscal_year = $${paramIndex++}`);
      values.push(fiscal_year);
    }
    if (month) {
      conditions.push(`f.month = $${paramIndex++}`);
      values.push(month);
    }
    if (status) {
      conditions.push(`f.status = $${paramIndex++}`);
      values.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM financials f WHERE 1=1 ${conditions.length > 0 ? 'AND ' + conditions.join(' AND ') : ''}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);
    
    // Get paginated results
    query += ` ORDER BY ${sort_by} ${sort_order} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    values.push(limit, offset);
    
    const result = await pool.query(query, values);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    handleDatabaseError(error, res, 'Error fetching financial records');
  }
};

// Get single financial record by ID
export const getFinancialById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        f.*,
        c.company_name as company_name,
        u.username as created_by_name
      FROM financials f
      LEFT JOIN company c ON f.company_id = c.company_id
      LEFT JOIN users u ON f.created_by = u.user_id
      WHERE f.financial_id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Financial record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleDatabaseError(error, res, 'Error fetching financial record');
  }
};

// Update financial record
export const updateFinancial = async (req, res) => {
  let client;
  try {
    const { id } = req.params;
    const financialData = req.body;
    
    client = await pool.connect();
    
    // Check if record exists
    const checkQuery = 'SELECT financial_id FROM financials WHERE financial_id = $1';
    const checkResult = await client.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Financial record not found'
      });
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    // Dynamically build update query
    const allowedFields = [
      'company_id', 'fiscal_year', 'month', 'status',
      'revenue', 'expenses', 'b2b_sales', 'b2c_sales', 'cash_balance', 'total_gst_liability',
      'input_tax_credit', 'monthly_gst_tax_paid', 'recv_not_due',
      'recv_less_30', 'recv_30_60', 'recv_60_90', 'recv_90_180',
      'recv_above_180', 'pay_not_due', 'pay_less_30', 'pay_30_60',
      'pay_60_90', 'pay_90_180', 'pay_above_180', 'current_assets',
      'current_liabilities', 'total_debt', 'wc_utilization_used',
      'working_capital_limit', 'short_term_debt', 'equity',
      'interest_expense', 'existing_loan_amount', 'loan_type',
      'emi_amount', 'interest_rate', 'loan_tenure_months',
      'emi_start_date', 'loan_security_collateral', 'overdue_amount',
      'credit_score', 'bank_nbfc_name', 'emi_delays_last_12_months',
      'loan_restructuring_history', 'rec_from_receivables',
      'paid_for_payables', 'paid_to_employees', 'other_overheads',
      'income_tax_paid', 'purchase_of_ppe', 'sale_of_ppe',
      'share_capital_issued', 'bank_loan_repaid', 'debentures_redeemed',
      'dividends_paid', 'cash_at_beginning', 'cash_at_end',
      'avg_monthly_inflows', 'avg_monthly_outflows',
      'months_with_cash_shortage', 'updated_at'
    ];
    
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    for (const field of allowedFields) {
      if (financialData[field] !== undefined) {
        updates.push(`${field} = $${paramIndex++}`);
        values.push(financialData[field]);
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    values.push(id);
    const query = `
      UPDATE financials 
      SET ${updates.join(', ')}
      WHERE financial_id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await client.query(query, values);
    
    await client.query('COMMIT');
    
    res.status(200).json({
      success: true,
      message: 'Financial record updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    handleDatabaseError(error, res, 'Error updating financial record');
  } finally {
    if (client) client.release();
  }
};

// Delete financial record
export const deleteFinancial = async (req, res) => {
  let client;
  try {
    const { id } = req.params;
    
    client = await pool.connect();
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if record exists
    const checkQuery = 'SELECT financial_id FROM financials WHERE financial_id = $1';
    const checkResult = await client.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Financial record not found'
      });
    }
    
    // Delete the record
    const deleteQuery = 'DELETE FROM financials WHERE financial_id = $1 RETURNING financial_id';
    const result = await client.query(deleteQuery, [id]);
    
    await client.query('COMMIT');
    
    res.status(200).json({
      success: true,
      message: 'Financial record deleted successfully',
      data: { deleted_id: parseInt(id) }
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    handleDatabaseError(error, res, 'Error deleting financial record');
  } finally {
    if (client) client.release();
  }
};

// Get financial records by company
export const getFinancialsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { fiscal_year, limit = 12 } = req.query;
    
    let query = `
      SELECT * FROM financials 
      WHERE company_id = $1
    `;
    const values = [companyId];
    let paramIndex = 2;
    
    if (fiscal_year) {
      query += ` AND fiscal_year = $${paramIndex++}`;
      values.push(fiscal_year);
    }
    
    query += ` ORDER BY fiscal_year DESC, 
      CASE 
        WHEN month = 'January' THEN 1
        WHEN month = 'February' THEN 2
        WHEN month = 'March' THEN 3
        WHEN month = 'April' THEN 4
        WHEN month = 'May' THEN 5
        WHEN month = 'June' THEN 6
        WHEN month = 'July' THEN 7
        WHEN month = 'August' THEN 8
        WHEN month = 'September' THEN 9
        WHEN month = 'October' THEN 10
        WHEN month = 'November' THEN 11
        WHEN month = 'December' THEN 12
        ELSE 13
      END DESC
      LIMIT $${paramIndex++}
    `;
    values.push(limit);
    
    const result = await pool.query(query, values);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    handleDatabaseError(error, res, 'Error fetching company financials');
  }
};

// Get financial summary for a company
export const getFinancialSummary = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { fiscal_year } = req.query;
    
    let query = `
      SELECT 
        SUM(revenue) as total_revenue,
        SUM(expenses) as total_expenses,
        SUM(net_profit) as total_net_profit,
        AVG(current_ratio) as avg_current_ratio,
        AVG(debt_to_equity_ratio) as avg_debt_to_equity,
        SUM(total_accounts_receivable) as total_receivables,
        SUM(total_accounts_payable) as total_payables,
        AVG(cash_reserve_months) as avg_cash_reserve_months
      FROM financials
      WHERE company_id = $1
    `;
    const values = [companyId];
    
    if (fiscal_year) {
      query += ` AND fiscal_year = $2`;
      values.push(fiscal_year);
    }
    
    const result = await pool.query(query, values);
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleDatabaseError(error, res, 'Error fetching financial summary');
  }
};

// Bulk delete financial records
export const bulkDeleteFinancials = async (req, res) => {
  let client;
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of financial record IDs to delete'
      });
    }
    
    client = await pool.connect();
    await client.query('BEGIN');
    
    const query = `DELETE FROM financials WHERE financial_id = ANY($1::int[]) RETURNING financial_id`;
    const result = await client.query(query, [ids]);
    
    await client.query('COMMIT');
    
    res.status(200).json({
      success: true,
      message: `${result.rows.length} financial records deleted successfully`,
      data: { deleted_ids: result.rows.map(row => row.financial_id) }
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    handleDatabaseError(error, res, 'Error deleting financial records');
  } finally {
    if (client) client.release();
  }
};