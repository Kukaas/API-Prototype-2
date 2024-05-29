import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as orderItemsService from './orderitems.server';

export const orderItemsRouter = express.Router();

//GET orderitems
orderItemsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const orderItems = await orderItemsService.getOrderItems();
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching orderitems:', error);
        res.status(500).send('Error fetching orderitems');
    }
});

//GET order items by ID
orderItemsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const orderItem = await orderItemsService.getOrderItemById(req.params.id);
        if (orderItem) {
            res.json(orderItem);
        } else {
            res.status(404).send('Order item not found');
        }
    } catch (error) {
        console.error('Error fetching order item:', error);
        res.status(500).send('Error fetching order item');
    }
});

//GET order items by order ID
orderItemsRouter.get('/order/:orderId', async (req: Request, res: Response) => {
    try {
        const orderItems = await orderItemsService.getOrderItemsByOrderId(req.params.orderId);
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).send('Error fetching order items');
    }
});