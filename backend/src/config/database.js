import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Create connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        return false;
    }
};

// Create tables only - no controller functions
export const createTables = async () => {
    try {
        // Create company table (company information)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS company (
                company_id SERIAL PRIMARY KEY,
                company_name VARCHAR(200) NOT NULL,
                industry VARCHAR(150),
                location VARCHAR(200),
                year_of_establishment INTEGER,
                number_of_employees INTEGER,
                installed_capacity VARCHAR(100),
                gst_number VARCHAR(50),
                pan_number VARCHAR(50),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_by INTEGER
            )
        `);

        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                company_id INTEGER NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
                employee_name VARCHAR(150) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            ALTER TABLE company
            ADD CONSTRAINT fk_company_updated_by
            FOREIGN KEY (updated_by) REFERENCES users(user_id)
            ON DELETE SET NULL
        `).catch((error) => {
            if (error.code !== '42710') {
                throw error;
            }
        });

        // Create indexes
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id)`);
        console.log('✅ Indexes created');


        // Create updated_at trigger function
        await pool.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql'
        `);

        // Create trigger
        await pool.query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            CREATE TRIGGER update_users_updated_at 
                BEFORE UPDATE ON users 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column()
        `);
        console.log('✅ Trigger created');

        // Create monthly_financial_entries table (MAIN monthly financial table)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS monthly_financial_entries (
                financial_id SERIAL PRIMARY KEY,
                company_id INT REFERENCES company(company_id),
                financial_month INT,
                financial_year INT,
                total_revenue NUMERIC(18,2),
                total_expenses NUMERIC(18,2),
                net_profit NUMERIC(18,2),
                cash_balance NUMERIC(18,2),
                total_gst_liability NUMERIC(18,2),
                total_itc NUMERIC(18,2),
                gst_tax_paid NUMERIC(18,2),
                itc_utilization_ratio NUMERIC(10,2),
                tax_to_revenue_ratio NUMERIC(10,2),
                current_assets NUMERIC(18,2),
                current_liabilities NUMERIC(18,2),
                working_capital NUMERIC(18,2),
                current_ratio NUMERIC(10,2),
                total_debt NUMERIC(18,2),
                wc_utilization_used NUMERIC(18,2),
                wc_limit NUMERIC(18,2),
                short_term_debt NUMERIC(18,2),
                equity NUMERIC(18,2),
                interest_expense NUMERIC(18,2),
                avg_monthly_inflows NUMERIC(18,2),
                avg_monthly_outflows NUMERIC(18,2),
                months_with_cash_shortage VARCHAR(100),
                cash_reserve_months NUMERIC(10,2),
                draft_status VARCHAR(20) DEFAULT 'Draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_b2b_sales table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_b2b_sales (
                b2b_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                invoice_no VARCHAR(100),
                invoice_date DATE,
                gstin_no VARCHAR(20),
                party_name VARCHAR(255),
                taxable_value NUMERIC(18,2),
                igst NUMERIC(18,2),
                cgst NUMERIC(18,2),
                sgst NUMERIC(18,2),
                cess NUMERIC(18,2),
                gst_tax_rate NUMERIC(5,2),
                category VARCHAR(100),
                product_service_name VARCHAR(255),
                hsn_sac_code VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_b2c_interstate_sales table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_b2c_interstate_sales (
                interstate_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                invoice_no VARCHAR(100),
                invoice_date DATE,
                place_of_supply VARCHAR(100),
                taxable_value NUMERIC(18,2),
                igst NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_b2c_intrastate_sales table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_b2c_intrastate_sales (
                intrastate_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                place_of_supply VARCHAR(100),
                taxable_value NUMERIC(18,2),
                cgst NUMERIC(18,2),
                sgst NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_exports table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_exports (
                export_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                invoice_no VARCHAR(100),
                invoice_date DATE,
                export_value NUMERIC(18,2),
                igst NUMERIC(18,2),
                port_code VARCHAR(50),
                shipping_bill VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_nil_exempt_sales table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_nil_exempt_sales (
                exempt_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                interstate_sales NUMERIC(18,2),
                intrastate_sales NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_credit_debit_notes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_credit_debit_notes (
                note_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                gstin_no VARCHAR(20),
                note_no VARCHAR(100),
                note_date DATE,
                note_type VARCHAR(20),
                note_value NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_advances_received table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_advances_received (
                advance_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                place_of_supply VARCHAR(100),
                gross_advance_received NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_hsn_summary table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_hsn_summary (
                hsn_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                hsn_code VARCHAR(50),
                total_qty NUMERIC(18,2),
                total_taxable_value NUMERIC(18,2),
                rate NUMERIC(5,2),
                igst NUMERIC(18,2),
                cgst NUMERIC(18,2),
                sgst NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create gst_documents_issued table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gst_documents_issued (
                document_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                total_invoices_issued INT,
                invoices_cancelled INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create receivable_ageing table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS receivable_ageing (
                ageing_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                not_due NUMERIC(18,2),
                below_30_days NUMERIC(18,2),
                days_30_60 NUMERIC(18,2),
                days_60_90 NUMERIC(18,2),
                days_90_180 NUMERIC(18,2),
                above_180_days NUMERIC(18,2),
                total_receivable NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create payable_ageing table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payable_ageing (
                payable_ageing_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                not_due NUMERIC(18,2),
                below_30_days NUMERIC(18,2),
                days_30_60 NUMERIC(18,2),
                days_60_90 NUMERIC(18,2),
                days_90_180 NUMERIC(18,2),
                above_180_days NUMERIC(18,2),
                total_payable NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create loan_emi_details table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS loan_emi_details (
                loan_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                existing_loan_amount NUMERIC(18,2),
                loan_type VARCHAR(100),
                emi_amount NUMERIC(18,2),
                interest_rate NUMERIC(10,2),
                loan_tenure_months INT,
                emi_start_date DATE,
                collateral VARCHAR(255),
                overdue_amount NUMERIC(18,2),
                credit_score INT,
                bank_name VARCHAR(255),
                emi_delays_last_12_months INT,
                restructuring_history TEXT,
                emi_burden_percent NUMERIC(10,2),
                debt_to_equity_ratio NUMERIC(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create cash_flow_statement table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cash_flow_statement (
                cashflow_id SERIAL PRIMARY KEY,
                financial_id INT REFERENCES monthly_financial_entries(financial_id),
                receivables_collected NUMERIC(18,2),
                payables_paid NUMERIC(18,2),
                employees_paid NUMERIC(18,2),
                other_overheads NUMERIC(18,2),
                income_tax_paid NUMERIC(18,2),
                purchase_of_ppe NUMERIC(18,2),
                sale_of_ppe NUMERIC(18,2),
                share_capital_issued NUMERIC(18,2),
                bank_loan_repaid NUMERIC(18,2),
                debentures_redeemed NUMERIC(18,2),
                dividends_paid NUMERIC(18,2),
                cash_at_beginning NUMERIC(18,2),
                cash_at_end NUMERIC(18,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create indexes for financial tables
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_monthly_financial_company_id ON monthly_financial_entries(company_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_monthly_financial_year_month ON monthly_financial_entries(financial_year, financial_month)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_gst_b2b_financial_id ON gst_b2b_sales(financial_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_receivable_ageing_financial_id ON receivable_ageing(financial_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_payable_ageing_financial_id ON payable_ageing(financial_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_loan_emi_financial_id ON loan_emi_details(financial_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_cashflow_financial_id ON cash_flow_statement(financial_id)`);
        console.log('✅ Financial tables and indexes created');

        console.log('✅ All tables created successfully');
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
};

// Export pool for queries
export default pool;