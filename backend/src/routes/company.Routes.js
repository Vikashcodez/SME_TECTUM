import express from 'express';
import {
    getAllCompanies,
    getCompanyById,
    updateCompany,
    patchCompany,
    searchCompanies
} from '../controllers/company.Controller.js';

const companyRouter = express.Router();


companyRouter.get('/', getAllCompanies);
companyRouter.get('/search', searchCompanies);
companyRouter.get('/:id', getCompanyById);
companyRouter.put('/:id', updateCompany);
companyRouter.patch('/:id', patchCompany);

export default companyRouter;