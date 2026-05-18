import express from 'express';
import * as controller from '../../controllers/finance/gstB2b.Controller.js';

const router = express.Router();

router.post('/', controller.createGstB2b);
router.get('/', controller.getAllGstB2b);
router.get('/:id', controller.getGstB2bById);
router.put('/:id', controller.updateGstB2b);
router.delete('/:id', controller.deleteGstB2b);

export default router;
