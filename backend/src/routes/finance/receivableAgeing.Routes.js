import express from 'express';
import * as controller from '../../controllers/finance/receivableAgeing.Controller.js';

const router = express.Router();

router.post('/', controller.createReceivableAgeing);
router.get('/', controller.getAllReceivableAgeing);
router.get('/:id', controller.getReceivableAgeingById);
router.put('/:id', controller.updateReceivableAgeing);
router.delete('/:id', controller.deleteReceivableAgeing);

export default router;
