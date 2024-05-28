import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import * as adminServer from './admin.server';  

export const adminRouter = express.Router();

//GET all admins
adminRouter.get('/', async (request: Request, response: Response) => {
    try {
        const admins = await adminServer.getAdmins();
        response.json(admins);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching admins' });
    }
});

//GET admin by ID
adminRouter.get('/:id', async (request: Request, response: Response) => {
    try {
        const admin = await adminServer.getAdminById(request.params.id);
        if (!admin) {
            response.status(404).json({ error: 'Admin not found' });
            return;
        }
        response.json(admin);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching admin by ID' });
    }
});

//POST create admin
adminRouter.post(
    '/',
    [
        body('name').isString().notEmpty(),
        body('email').isEmail(),
        body('passwordHash').isString().notEmpty(),
        body('address').isString().notEmpty(),
        body('contactNumber').isString().notEmpty(),
        body('birthDate').isDate(), 
    ],
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.array() });
            return;
        }

        const { name, email } = request.body;
        const birthDate = new Date(request.body.birthDate).toISOString();

        // Check if an admin with the same email or name already exists
        const existingAdmin = await prisma.admin.findFirst({
            where: {
                OR: [
                    { name },
                    { email }
                ]
            }
        });
        if (existingAdmin) {
            response.status(400).json({ error: 'Admin with the same name or email already exists' });
            return;
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(request.body.passwordHash, saltRounds);
        
        const admin = {
            ...request.body,
            birthDate,
            passwordHash
        };

        try {
            const newAdmin = await adminServer.createAdmin(admin);
            response.json({newAdmin, message: 'Admin created successfully'});
        } catch (error) {
            response.status(500).json({ error: 'Error creating admin' });
        }
    }
);


//PUT update admin
adminRouter.put(
    '/:id',
    [
        body('name').isString().notEmpty(),
        body('email').isEmail(),
        body('passwordHash').isString().notEmpty(),
        body('address').isString().notEmpty(),
        body('contactNumber').isString().notEmpty(),
        body('birthDate').isDate(), 
    ],
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.array() });
            return;
        }

        const { name, email } = request.body;
        const birthDate = new Date(request.body.birthDate).toISOString();


        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(request.body.passwordHash, saltRounds);
        
        const admin = {
            ...request.body,
            birthDate,
            passwordHash
        };

        try {
            const updatedAdmin = await adminServer.updateAdmin(request.params.id, admin);
            response.json({updatedAdmin, message: 'Admin updated successfully'});
        } catch (error) {
            response.status(500).json({ error: 'Error updating admin' });
        }
    }
);