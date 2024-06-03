import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as productionServer from './production.server';

export const productionRouter = express.Router();

// Get all productions
productionRouter.get('/', async (req: Request, res: Response) => {
    try {
        const productions = await productionServer.getProductions();
        res.status(200).json(productions);
    } catch (error) {
        res.status(500).send('Error fetching productions');
    }
});

// Get production by ID
productionRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const production = await productionServer.getProductionById(req.params.id);
        if (!production) {
            res.status(404).send('Production not found');
        } else {
            res.status(200).json(production);
        }
    } catch (error) {
        res.status(500).send('Error fetching production by ID');
    }
});

// Create production
productionRouter.post('/', [
    body('level').isString().optional(),
    body('productType').isString().optional(),
    body('quantity').isNumeric().optional(),
    body('size').isString().optional(),
    body('status').isString().optional(),
    body('email').isEmail(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { level, productType, quantity, size, status, productionStartTime, email } = req.body;
    const productionStartTimeISO = new Date(productionStartTime).toISOString();

    const userExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    
    if (!userExists) {
        throw new Error('User not found');
    }

    try {

        const production = await productionServer.createProduction({
            level,
            productType,
            quantity,
            size,
            status,
            productionStartTime: productionStartTimeISO,
            user: {
                connect: {
                    email: email
                }
            }
        });

        res.status(201).json(production);
    } catch (error) {
        res.status(500).send('Error creating production');
    }
});

// Update production
productionRouter.put('/:id', [
    body('level').isString().optional(),
    body('productType').isString().optional(),
    body('quantity').isNumeric().optional(),
    body('size').isString().optional(),
    body('status').isString().optional(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const production = await productionServer.updateProduction(req.params.id, req.body);
        if (!production) {
            res.status(404).send('Production not found');
        } else {
            res.status(200).json(production);
        }
    } catch (error) {
        res.status(500).send('Error updating production');
    }
});

//Delete production
productionRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const production = await productionServer.deleteProduction(req.params.id);
        if (!production) {
            res.status(404).send('Production not found');
        } else {
            res.status(200).json(production);
        }
    } catch (error) {
        res.status(500).send('Error deleting production');
    }
});

//GEt production by user ID
productionRouter.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const productions = await productionServer.getProductionByUserId(req.params.userId);
        res.status(200).json(productions);
    } catch (error) {
        res.status(500).send('Error fetching productions by user ID');
    }
});

//GET production by User name
productionRouter.get('/name/:name', async (req: Request, res: Response) => {
    try {
        const productions = await productionServer.getProductionByUserName(req.params.name);
        res.status(200).json(productions);
    } catch (error) {
  console.error('Error fetching productions by user name:', error);
  res.status(500).send('Error fetching productions by user name');
}
});