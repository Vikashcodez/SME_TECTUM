import express from 'express';
import * as controller from '../../controllers/finance/gstDocuments.Controller.js';

const router = express.Router();

router.post('/', controller.createGstDocument);
router.get('/', controller.getAllGstDocuments);
router.get('/:id', controller.getGstDocumentById);
router.put('/:id', controller.updateGstDocument);
router.delete('/:id', controller.deleteGstDocument);

export default router;
