import express from 'express';
import * as controller from '../../controllers/finance/gstExports.Controller.js';

const router = express.Router();

router.post('/', controller.createGstExport);
router.get('/', controller.getAllGstExports);
router.get('/:id', controller.getGstExportById);
router.put('/:id', controller.updateGstExport);
router.delete('/:id', controller.deleteGstExport);

export default router;
