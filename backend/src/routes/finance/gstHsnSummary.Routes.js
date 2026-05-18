import express from 'express';
import * as controller from '../../controllers/finance/gstHsnSummary.Controller.js';

const router = express.Router();

router.post('/', controller.createGstHsn);
router.get('/', controller.getAllGstHsn);
router.get('/:id', controller.getGstHsnById);
router.put('/:id', controller.updateGstHsn);
router.delete('/:id', controller.deleteGstHsn);

export default router;
