import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as inventoryServer from './inventory.server';

export const inventoryRouter = express.Router();

// GET all inventory
inventoryRouter.get('/', async (req: Request, res: Response) => {
  const inventory = await inventoryServer.getInventories();
  res.json(inventory);
});

// GET inventory by ID
inventoryRouter.get('/:id', async (req: Request, res: Response) => {
  const inventory = await inventoryServer.getInventoryById(req.params.id);
  if (inventory) {
    res.json(inventory);
  } else {
    res.status(404).send('Inventory not found');
  }
});

// POST create inventory
inventoryRouter.post(
  '/',
  body('level').isString(),
  body('productType').isString(),
  body('quantity').isInt(),
  body('size').optional().isString(),
  body('status').isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inventory = await inventoryServer.createInventory(req.body);
    res.json(inventory);
  }
);

// PUT update inventory by ID
inventoryRouter.put(
  '/:id',
  body('level').isString().optional(),
  body('productType').isString().optional(),
  body('quantity').isInt().optional(),
  body('size').optional().isString(),
  body('status').isString().optional(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inventory = await inventoryServer.updateInventory(req.params.id, req.body);
    if (inventory) {
      res.json(inventory);
    } else {
      res.status(404).send('Inventory not found');
    }
  }
);

// DELETE inventory by ID
inventoryRouter.delete('/:id', async (req: Request, res: Response) => {
  const inventory = await inventoryServer.deleteInventory(req.params.id);
  if (inventory) {
    res.json(inventory);
  } else {
    res.status(404).send('Inventory not found');
  }
});