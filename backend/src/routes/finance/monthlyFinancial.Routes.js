import express from 'express';
import * as controller from '../../controllers/finance/monthlyFinancial.Controller.js';

const router = express.Router();

router.post('/', controller.createMonthlyFinancial);
router.get('/', controller.getAllMonthlyFinancial);
router.get('/:id', controller.getMonthlyFinancialById);
router.put('/:id', controller.updateMonthlyFinancial);
router.delete('/:id', controller.deleteMonthlyFinancial);

export default router;
