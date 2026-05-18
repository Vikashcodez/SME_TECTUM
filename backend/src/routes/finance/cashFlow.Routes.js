import express from 'express';
import * as controller from '../../controllers/finance/cashFlow.Controller.js';

const router = express.Router();

router.post('/', controller.createCashFlow);
router.get('/', controller.getAllCashFlow);
router.get('/:id', controller.getCashFlowById);
router.put('/:id', controller.updateCashFlow);
router.delete('/:id', controller.deleteCashFlow);

export default router;
