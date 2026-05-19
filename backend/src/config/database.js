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

        //financials table (monthly financial data for each company)

        await pool.query(`
    CREATE TABLE IF NOT EXISTS financials (
        financial_id SERIAL PRIMARY KEY,

        company_id INTEGER NOT NULL 
        REFERENCES company(company_id) 
        ON DELETE CASCADE,

        fiscal_year VARCHAR(20) NOT NULL,
        month VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'Draft',

        -- Revenue & Expenses
        revenue NUMERIC(15,2) DEFAULT 0,
        expenses NUMERIC(15,2) DEFAULT 0,
        b2b_sales NUMERIC(15,2) DEFAULT 0,
        b2c_sales NUMERIC(15,2) DEFAULT 0,
        net_profit NUMERIC(15,2) GENERATED ALWAYS AS 
            (revenue - expenses) STORED,

        cash_balance NUMERIC(15,2) DEFAULT 0,

        -- GST Totals
        total_gst_liability NUMERIC(15,2) DEFAULT 0,
        input_tax_credit NUMERIC(15,2) DEFAULT 0,
        monthly_gst_tax_paid NUMERIC(15,2) DEFAULT 0,

        itc_utilization_ratio NUMERIC(10,2) GENERATED ALWAYS AS (
            CASE
                WHEN total_gst_liability > 0
                THEN (input_tax_credit / total_gst_liability) * 100
                ELSE 0
            END
        ) STORED,

        tax_to_revenue_ratio NUMERIC(10,2) GENERATED ALWAYS AS (
            CASE
                WHEN revenue > 0
                THEN (monthly_gst_tax_paid / revenue) * 100
                ELSE 0
            END
        ) STORED,

        -- Receivables Ageing
        recv_not_due NUMERIC(15,2) DEFAULT 0,
        recv_less_30 NUMERIC(15,2) DEFAULT 0,
        recv_30_60 NUMERIC(15,2) DEFAULT 0,
        recv_60_90 NUMERIC(15,2) DEFAULT 0,
        recv_90_180 NUMERIC(15,2) DEFAULT 0,
        recv_above_180 NUMERIC(15,2) DEFAULT 0,

        total_accounts_receivable NUMERIC(15,2) GENERATED ALWAYS AS (
            recv_not_due + recv_less_30 + recv_30_60 +
            recv_60_90 + recv_90_180 + recv_above_180
        ) STORED,

        -- Payables Ageing
        pay_not_due NUMERIC(15,2) DEFAULT 0,
        pay_less_30 NUMERIC(15,2) DEFAULT 0,
        pay_30_60 NUMERIC(15,2) DEFAULT 0,
        pay_60_90 NUMERIC(15,2) DEFAULT 0,
        pay_90_180 NUMERIC(15,2) DEFAULT 0,
        pay_above_180 NUMERIC(15,2) DEFAULT 0,

        total_accounts_payable NUMERIC(15,2) GENERATED ALWAYS AS (
            pay_not_due + pay_less_30 + pay_30_60 +
            pay_60_90 + pay_90_180 + pay_above_180
        ) STORED,

        -- Working Capital
        current_assets NUMERIC(15,2) DEFAULT 0,
        current_liabilities NUMERIC(15,2) DEFAULT 0,

        working_capital NUMERIC(15,2) GENERATED ALWAYS AS (
            current_assets - current_liabilities
        ) STORED,

        current_ratio NUMERIC(10,2) GENERATED ALWAYS AS (
            CASE
                WHEN current_liabilities > 0
                THEN current_assets / current_liabilities
                ELSE 0
            END
        ) STORED,

        total_debt NUMERIC(15,2) DEFAULT 0,
        wc_utilization_used NUMERIC(15,2) DEFAULT 0,
        working_capital_limit NUMERIC(15,2) DEFAULT 0,
        short_term_debt NUMERIC(15,2) DEFAULT 0,
        equity NUMERIC(15,2) DEFAULT 0,
        interest_expense NUMERIC(15,2) DEFAULT 0,

        -- Loan Details
        existing_loan_amount NUMERIC(15,2) DEFAULT 0,
        loan_type VARCHAR(100),
        emi_amount NUMERIC(15,2) DEFAULT 0,
        interest_rate NUMERIC(5,2) DEFAULT 0,
        loan_tenure_months INTEGER,
        emi_start_date DATE,
        loan_security_collateral VARCHAR(255),
        overdue_amount NUMERIC(15,2) DEFAULT 0,
        credit_score INTEGER,
        bank_nbfc_name VARCHAR(255),
        emi_delays_last_12_months INTEGER DEFAULT 0,
        loan_restructuring_history TEXT,

        emi_burden_percent NUMERIC(10,2) GENERATED ALWAYS AS (
            CASE
                WHEN (revenue - expenses) > 0
                THEN (emi_amount / (revenue - expenses)) * 100
                ELSE 0
            END
        ) STORED,

        debt_to_equity_ratio NUMERIC(10,2) GENERATED ALWAYS AS (
            CASE
                WHEN equity > 0
                THEN total_debt / equity
                ELSE 0
            END
        ) STORED,

        -- Cash Flow Statement
        rec_from_receivables NUMERIC(15,2) DEFAULT 0,
        paid_for_payables NUMERIC(15,2) DEFAULT 0,
        paid_to_employees NUMERIC(15,2) DEFAULT 0,
        other_overheads NUMERIC(15,2) DEFAULT 0,
        income_tax_paid NUMERIC(15,2) DEFAULT 0,

        purchase_of_ppe NUMERIC(15,2) DEFAULT 0,
        sale_of_ppe NUMERIC(15,2) DEFAULT 0,
        share_capital_issued NUMERIC(15,2) DEFAULT 0,
        bank_loan_repaid NUMERIC(15,2) DEFAULT 0,
        debentures_redeemed NUMERIC(15,2) DEFAULT 0,
        dividends_paid NUMERIC(15,2) DEFAULT 0,

        cash_at_beginning NUMERIC(15,2) DEFAULT 0,
        cash_at_end NUMERIC(15,2) DEFAULT 0,

        -- Cash Reserve
        avg_monthly_inflows NUMERIC(15,2) DEFAULT 0,
        avg_monthly_outflows NUMERIC(15,2) DEFAULT 0,
        months_with_cash_shortage VARCHAR(255),

        cash_reserve_months NUMERIC(10,2) GENERATED ALWAYS AS (
            CASE
                WHEN avg_monthly_outflows > 0
                THEN cash_balance / avg_monthly_outflows
                ELSE 0
            END
        ) STORED,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);


// GST B2B SALES

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_b2b_sales (
    b2b_sale_id SERIAL PRIMARY KEY,
    financial_id INTEGER NOT NULL REFERENCES financials(financial_id) ON DELETE CASCADE,

    invoice_no VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,

    gstin_no VARCHAR(20),
    party_name VARCHAR(255),

    taxable_value NUMERIC(15,2) DEFAULT 0,

    igst NUMERIC(15,2) DEFAULT 0,
    cgst NUMERIC(15,2) DEFAULT 0,
    sgst NUMERIC(15,2) DEFAULT 0,
    cess NUMERIC(15,2) DEFAULT 0,

    gst_tax_rate NUMERIC(5,2),

    category VARCHAR(100),
    product_service VARCHAR(255),

    hsn_sac_code VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


//GST B2C INTER STATE SALES

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_b2c_inter_state_sales (
    inter_state_sale_id SERIAL PRIMARY KEY,

    financial_id INTEGER NOT NULL REFERENCES financials(financial_id) ON DELETE CASCADE,

    invoice_no VARCHAR(100),
    invoice_date DATE,

    place_of_supply VARCHAR(255),

    taxable_value NUMERIC(15,2) DEFAULT 0,
    igst NUMERIC(15,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


//GST B2C INTRA STATE SALES

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_b2c_intra_state_sales (
    intra_state_sale_id SERIAL PRIMARY KEY,

    financial_id INTEGER NOT NULL REFERENCES financials(financial_id) ON DELETE CASCADE,

    place_of_supply VARCHAR(255),

    taxable_value NUMERIC(15,2) DEFAULT 0,

    cgst NUMERIC(15,2) DEFAULT 0,
    sgst NUMERIC(15,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


//GST EXPORT SALES

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_exports (
    export_id SERIAL PRIMARY KEY,

    financial_id INTEGER NOT NULL REFERENCES financials(financial_id) ON DELETE CASCADE,

    invoice_no VARCHAR(100),
    invoice_date DATE,

    export_value NUMERIC(15,2) DEFAULT 0,
    igst NUMERIC(15,2) DEFAULT 0,

    port_code VARCHAR(100),
    shipping_bill VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


//NIL RATED / EXEMPT SALES

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_nil_exempt_sales (
    nil_sale_id SERIAL PRIMARY KEY,

    financial_id INTEGER NOT NULL
    REFERENCES financials(financial_id)
    ON DELETE CASCADE,

    inter_state_sales NUMERIC(15,2) DEFAULT 0,
    intra_state_sales NUMERIC(15,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


//CREDIT / DEBIT NOTES

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_credit_debit_notes (
    note_id SERIAL PRIMARY KEY,

    financial_id INTEGER NOT NULL
    REFERENCES financials(financial_id)
    ON DELETE CASCADE,

    gstin_no VARCHAR(20),

    note_no VARCHAR(100),
    note_date DATE,

    note_value NUMERIC(15,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


// ADVANCES RECEIVED

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_advances_received (
    advance_id SERIAL PRIMARY KEY,

    financial_id INTEGER NOT NULL
    REFERENCES financials(financial_id)
    ON DELETE CASCADE,

    place_of_supply VARCHAR(255),

    gross_advance_received NUMERIC(15,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


//HSN WISE SUMMARY

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_hsn_summary (
    hsn_id SERIAL PRIMARY KEY,

    financial_id INTEGER NOT NULL
    REFERENCES financials(financial_id)
    ON DELETE CASCADE,

    hsn_code VARCHAR(50),

    total_qty NUMERIC(15,2) DEFAULT 0,

    total_taxable_value NUMERIC(15,2) DEFAULT 0,

    rate NUMERIC(5,2),

    igst NUMERIC(15,2) DEFAULT 0,
    cgst NUMERIC(15,2) DEFAULT 0,
    sgst NUMERIC(15,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


// DOCUMENTS ISSUED

await pool.query(`
CREATE TABLE IF NOT EXISTS gst_documents_issued (
    document_id SERIAL PRIMARY KEY,

    financial_id INTEGER NOT NULL
    REFERENCES financials(financial_id)
    ON DELETE CASCADE,

    total_invoices_issued INTEGER DEFAULT 0,
    invoices_cancelled INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
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


        console.log('✅ All tables created successfully');
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
};

// Export pool for queries
export default pool;