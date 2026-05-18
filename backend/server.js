import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection, createTables } from './src/config/database.js';
import authRouter from './src/routes/auth.Routes.js';
import companyRouter from './src/routes/company.Routes.js';
import financeRoutes from './src/routes/finance/index.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/companies', companyRouter);
// Finance routes (mounted by resource)
app.use('/api/finance/monthly', financeRoutes.monthlyFinancial);
app.use('/api/finance/gst/b2b', financeRoutes.gstB2b);
app.use('/api/finance/gst/b2c/interstate', financeRoutes.gstB2cInterstate);
app.use('/api/finance/gst/b2c/intrastate', financeRoutes.gstB2cIntrastate);
app.use('/api/finance/gst/exports', financeRoutes.gstExports);
app.use('/api/finance/gst/nil_exempt', financeRoutes.gstNilExempt);
app.use('/api/finance/gst/credit_debit', financeRoutes.gstCreditDebit);
app.use('/api/finance/gst/advances', financeRoutes.gstAdvances);
app.use('/api/finance/gst/hsn', financeRoutes.gstHsnSummary);
app.use('/api/finance/gst/documents', financeRoutes.gstDocuments);
app.use('/api/finance/receivable_ageing', financeRoutes.receivableAgeing);
app.use('/api/finance/payable_ageing', financeRoutes.payableAgeing);
app.use('/api/finance/loan_emi', financeRoutes.loanEmi);
app.use('/api/finance/cash_flow', financeRoutes.cashFlow);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        // Test database connection
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('Failed to connect to database. Exiting...');
            process.exit(1);
        }
        
        // Create tables
        await createTables();
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📝 API URL: http://localhost:${PORT}/api/auth`);
            console.log(`✅ Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();