import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as finishedProductServer from './finishedproduct.server';

export const finishedProductRouter = express.Router();

// GET all finished products
finishedProductRouter.get('/', async (req: Request, res: Response) => {
  const finishedProducts = await finishedProductServer.getFinishedProducts();
  res.json(finishedProducts);
});

// GET finished product by ID
finishedProductRouter.get('/:id', async (req: Request, res: Response) => {
  const finishedProduct = await finishedProductServer.getFinishedProductById(req.params.id);
  if (finishedProduct) {
    res.json(finishedProduct);
  } else {
    res.status(404).send('Finished product not found');
  }
});

// POST create finished product
finishedProductRouter.post(
  '/',
  body('level').isString(),
  body('productType').isString(),
  body('quantity').isInt(),
  body('size').optional().isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const finishedProduct = await finishedProductServer.createFinishedProduct(req.body);
    res.json(finishedProduct);
  }
);

// PUT update finished product by ID
finishedProductRouter.put(
  '/:id',
  body('level').isString().optional(),
  body('productType').isString().optional(),
  body('quantity').isInt().optional(),
  body('size').optional().isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const finishedProduct = await finishedProductServer.updateFinishedProduct(req.params.id, req.body);
    if (finishedProduct) {
      res.json(finishedProduct);
    } else {
      res.status(404).send('Finished product not found');
    }
  }
);

// DELETE finished product by ID
finishedProductRouter.delete('/:id', async (req: Request, res: Response) => {
  const finishedProduct = await finishedProductServer.deleteFinishedProduct(req.params.id);
  if (finishedProduct) {
    res.json(finishedProduct);
  } else {
    res.status(404).send('Finished product not found');
  }
});

//GET finished product by user ID
finishedProductRouter.get('/user/:id', async (req: Request, res: Response) => {
  const finishedProduct = await finishedProductServer.getFinishedProductByUserId(req.params.id);
  if (finishedProduct) {
    res.json(finishedProduct);
  } else {
    res.status(404).send('Finished product not found');
  }
});