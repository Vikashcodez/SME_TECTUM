import express from 'express';
import * as controller from '../../controllers/finance/gstNilExempt.Controller.js';

const router = express.Router();

router.post('/', controller.createGstNilExempt);
router.get('/', controller.getAllGstNilExempt);
router.get('/:id', controller.getGstNilExemptById);
router.put('/:id', controller.updateGstNilExempt);
router.delete('/:id', controller.deleteGstNilExempt);

export default router;
