import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as salesReportServer from './salesreport.server';

export const salesReportRouter = express.Router();

//Create a new sales report
salesReportRouter.post('/', async (req: Request, res: Response) => {
    try {
        const salesReport = await salesReportServer.generateSalesReport(req.body.productType, req.body.level, req.body.size);
        res.status(200).json(salesReport);
    } catch (error) {
        res.status(500).send(error);
    }
});

//GET ALL SALES REPORTS
salesReportRouter.get('/', async (req: Request, res: Response) => {
    try {
        const salesReports = await salesReportServer.getSalesReports();
        res.status(200).json(salesReports);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get sales report by id
salesReportRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const salesReport = await salesReportServer.getSalesReportById(req.params.id);
        res.status(200).json(salesReport);
    } catch (error) {
        res.status(500).send(error);
    }
});

//DELETE SALES REPORT
salesReportRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const salesReport = await salesReportServer.deleteSalesReport(req.params.id);
        res.status(200).json({salesReport, message: 'Sales report deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
});