import express from 'express';
import * as controller from '../../controllers/finance/gstCreditDebit.Controller.js';

const router = express.Router();

router.post('/', controller.createGstCreditDebit);
router.get('/', controller.getAllGstCreditDebit);
router.get('/:id', controller.getGstCreditDebitById);
router.put('/:id', controller.updateGstCreditDebit);
router.delete('/:id', controller.deleteGstCreditDebit);

export default router;
