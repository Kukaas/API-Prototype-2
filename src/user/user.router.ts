import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import * as userServer from './user.server';

export const userRouter = express.Router();

//GET all users
userRouter.get('/', async (request: Request, response: Response) => {
    try {
        const users = await userServer.getUsers();
        response.json(users);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching users' });
    }
});

//GET user by ID
userRouter.get('/:id', async (request: Request, response: Response) => {
    try {
        const user = await userServer.getUserById(request.params.id);
        if (!user) {
            response.status(404).json({ error: 'User not found' });
            return;
        }
        response.json(user);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching user by ID' });
    }
});

//POST create user
userRouter.post(
    '/',
    [
        body('name').isString().notEmpty(),
        body('email').isEmail(),
        body('passwordHash').isString().notEmpty(),
        body('address').isString().notEmpty(),
        body('contactNumber').isString().notEmpty(),
        body('birthDate').isDate(), 
        body('address').isString().notEmpty(),  
        body('role').isString().notEmpty(),
    ],
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.array() });
            return;
        }

        const { name, email } = request.body;
        const birthDate = new Date(request.body.birthDate).toISOString();

        // Check if a user with the same email or name already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { name },
                ],
            },
        });

        if (existingUser) {
            response.status(409).json({ error: 'User already exists' });
            return;
        }

        const user = {
            ...request.body,
            birthDate,
        };

        //Hash password
        const saltRounds = 10;
        user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);

        try {
            const newUser = await userServer.createUser(user);
            response.json({newUser, message: 'User created successfully'});
        } catch (error) {
            response.status(500).json({ error: 'Error creating user' });
        }
    }
);

//PUT update user
userRouter.put(
    '/:id',
    [
        body('name').isString().optional(),
        body('email').isEmail().optional(),
        body('passwordHash').isString().optional(),
        body('address').isString().optional(),
        body('contactNumber').isString().optional(),
        body('birthDate').isDate().optional(), 
        body('address').isString().optional(),  
    ],
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.array() });
            return;
        }

        const birthDate = new Date(request.body.birthDate).toISOString();

        const user = {
            ...request.body,
            birthDate,
        };

        try {
            const updatedUser = await userServer.updateUser(request.params.id, user);
            response.json({updatedUser, message: 'User updated successfully'});
        } catch (error) {
            response.status(500).json({ error: 'Error updating user' });
        }
    }
);

//DELETE user
userRouter.delete('/:id', async (request: Request, response: Response) => {
    try {
        await userServer.deleteUser(request.params.id);
        response.json({ message: 'User deleted successfully' });
    } catch (error) {
        response.status(500).json({ error: 'Error deleting user' });
    }
});

//POST login
userRouter.post(
    '/login',
    [
        body('email').isEmail(),
        body('passwordHash').isString().notEmpty(),
    ],
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const user = await userServer.login(request.body.email, request.body.passwordHash);
            if (!user) {
                response.status(401).json({ error: 'Invalid email or password' });
                return;
            }
            response.json(user);
        } catch (error) {
            response.status(500).json({ error: 'Error logging in' });
        }
    }
);