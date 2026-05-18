import express from 'express';
import * as controller from '../../controllers/finance/loanEmi.Controller.js';

const router = express.Router();

router.post('/', controller.createLoanEmi);
router.get('/', controller.getAllLoanEmi);
router.get('/:id', controller.getLoanEmiById);
router.put('/:id', controller.updateLoanEmi);
router.delete('/:id', controller.deleteLoanEmi);

export default router;
