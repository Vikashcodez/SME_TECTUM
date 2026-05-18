// financials.routes.js
import express from 'express';
import {
  createFinancial,
  getAllFinancials,
  getFinancialById,
  updateFinancial,
  deleteFinancial,
  getFinancialsByCompany,
  getFinancialSummary,
  bulkDeleteFinancials
} from '../../controllers/finance/finanace.Controller.js';

const financeRouter = express.Router();


// Routes
financeRouter.post('/', createFinancial);
financeRouter.get('/', getAllFinancials);
financeRouter.get('/summary/:companyId', getFinancialSummary);
financeRouter.get('/company/:companyId', getFinancialsByCompany);
financeRouter.get('/:id', getFinancialById);
financeRouter.put('/:id', updateFinancial);
financeRouter.delete('/:id', deleteFinancial);
financeRouter.post('/bulk-delete', bulkDeleteFinancials);

export default financeRouter;