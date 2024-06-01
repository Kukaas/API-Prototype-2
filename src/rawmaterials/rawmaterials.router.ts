import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as rawMaterialsServer from './rawmaterials.server';   

export const rawMaterialsRouter = express.Router(); 

// Get all raw materials
rawMaterialsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const rawMaterials = await rawMaterialsServer.getRawMaterials();
        res.status(200).json(rawMaterials);
    } catch (error) {
        res.status(500).send('Error fetching raw materials');
    }
});

// Get raw material by ID
rawMaterialsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const rawMaterial = await rawMaterialsServer.getRawMaterialById(req.params.id);
        if (!rawMaterial) {
            res.status(404).send('Raw material not found');
        } else {
            res.status(200).json(rawMaterial);
        }
    } catch (error) {
        res.status(500).send('Error fetching raw material by ID');
    }
});

// Create raw material
rawMaterialsRouter.post('/', [
    body('rawMaterialType').isString().optional(),
    body('quantity').isNumeric().optional(),
    body('unit').isString().optional(),
    body('status').isString().optional(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rawMaterialType, quantity, unit, status } = req.body;

    try {
        const rawMaterial = await rawMaterialsServer.createRawMaterial({ rawMaterialType, quantity, unit, status });
        res.status(201).json(rawMaterial);
    } catch (error) {
        res.status(500).send('Error creating raw material');
    }
});

//Update raw material
rawMaterialsRouter.put('/:id', [
    body('rawMaterialType').isString().optional(),
    body('quantity').isNumeric().optional(),
    body('unit').isString().optional(),
    body('status').isString().optional(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rawMaterialType, quantity, unit, status } = req.body;

    try {
        const rawMaterial = await rawMaterialsServer.updateRawMaterial(req.params.id, { rawMaterialType, quantity, unit, status });
        if (!rawMaterial) {
            res.status(404).send('Raw material not found');
        } else {
            res.status(200).json(rawMaterial);
        }
    } catch (error) {
        res.status(500).send('Error updating raw material');
    }
});

//Delete raw material
rawMaterialsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const rawMaterial = await rawMaterialsServer.deleteRawMaterial(req.params.id);
        if (!rawMaterial) {
            res.status(404).send('Raw material not found');
        } else {
            res.status(200).json(rawMaterial);
        }
    } catch (error) {
        res.status(500).send('Error deleting raw material');
    }
});