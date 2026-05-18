import express from 'express';
import * as controller from '../../controllers/finance/gstB2cIntrastate.Controller.js';

const router = express.Router();

router.post('/', controller.createGstB2cIntrastate);
router.get('/', controller.getAllGstB2cIntrastate);
router.get('/:id', controller.getGstB2cIntrastateById);
router.put('/:id', controller.updateGstB2cIntrastate);
router.delete('/:id', controller.deleteGstB2cIntrastate);

export default router;
