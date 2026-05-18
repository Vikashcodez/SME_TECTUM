import express from 'express';
import * as controller from '../../controllers/finance/payableAgeing.Controller.js';

const router = express.Router();

router.post('/', controller.createPayableAgeing);
router.get('/', controller.getAllPayableAgeing);
router.get('/:id', controller.getPayableAgeingById);
router.put('/:id', controller.updatePayableAgeing);
router.delete('/:id', controller.deletePayableAgeing);

export default router;
