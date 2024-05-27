import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as orderServer from './order.server';

export const orderRouter = express.Router();

// GET ALL ORDERS
orderRouter.get('/', async (req: Request, res: Response) => {
    try {
        const orders = await orderServer.getOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).send('Error fetching orders');
    }
});

// GET ORDER BY ID
orderRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const order = await orderServer.getOrderById(req.params.id);
        if (!order) {
            res.status(404).send('Order not found');
        } else {
            res.status(200).json(order);
        }
    } catch (error) {
        res.status(500).send('Error fetching order by ID');
    }
});

// CREATE ORDER
orderRouter.post('/', [
    body('studentNumber').isString(),
    body('studentName').isString(),
    body('gender').isString(),
    body('status').isString(),
    body('orderItems').isArray(),
    body('orderItems.*.level').isString(),
    body('orderItems.*.productType').isString(),
    body('orderItems.*.quantity').isNumeric(),
    body('orderItems.*.size').isString(),
    body('orderItems.*.unitPrice').isNumeric(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const order = req.body;
    try {
        const newOrder = await orderServer.createOrder(order, order.orderItems);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).send('Error creating order');
    }
});
