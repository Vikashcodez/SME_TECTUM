import express from 'express';
import * as controller from '../../controllers/finance/gstAdvances.Controller.js';

const router = express.Router();

router.post('/', controller.createGstAdvance);
router.get('/', controller.getAllGstAdvances);
router.get('/:id', controller.getGstAdvanceById);
router.put('/:id', controller.updateGstAdvance);
router.delete('/:id', controller.deleteGstAdvance);

export default router;
