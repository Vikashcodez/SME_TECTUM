import express from 'express';
import * as controller from '../../controllers/finance/gstB2cInterstate.Controller.js';

const router = express.Router();

router.post('/', controller.createGstB2cInterstate);
router.get('/', controller.getAllGstB2cInterstate);
router.get('/:id', controller.getGstB2cInterstateById);
router.put('/:id', controller.updateGstB2cInterstate);
router.delete('/:id', controller.deleteGstB2cInterstate);

export default router;
