import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as orderitemsServer from './orderitems.server';

// GET ALL ORDERITEMS
export const getOrderitems = async (req: Request, res: Response) => {
    try {
        const orderitems = await orderitemsServer.getOrderitems();
        res.status(200).json(orderitems);
    } catch (error) {
        res.status(500).send('Error fetching orderitems');
    }
};

// GET ORDERITEM BY ID
export const getOrderitemById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const orderitem = await orderitemsServer.getOrderitemById(id);
        res.status(200).json(orderitem);
    } catch (error) {
        res.status(500).send('Error fetching orderitem');
    }
};