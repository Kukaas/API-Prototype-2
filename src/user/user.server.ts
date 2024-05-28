import { prisma } from '../utils/prisma.server';

type User = {
    name: string;
    email: string;
    passwordHash: string;
    birthDate: Date;
    address: string | null;
    contactNumber: string | null;
    role: string;
};


//GET ALL USERS
export const getUsers = async (): Promise<User[]> => {
    try {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // re-throw the error to be handled by the caller or an error handler middleware
    }
};

//GET user by ID
export const getUserById = async (id: string): Promise<User | null> => {
    try {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
        });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
}

//CREATE user
export const createUser = async (user: User): Promise<User> => {
    try {
        return await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
                birthDate: user.birthDate,
                address: user.address,
                contactNumber: user.contactNumber,
                role: user.role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

//UPDATE user
export const updateUser = async (id: string, user: User): Promise<User> => {
    try {
        return await prisma.user.update({
            where: { id },
            data: {
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
                birthDate: user.birthDate,
                address: user.address,
                contactNumber: user.contactNumber,
                role: user.role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

//DELETE user
export const deleteUser = async (id: string): Promise<User> => {
    try {
        return await prisma.user.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

//POST to login
export const login = async (email: string, passwordHash: string): Promise<User | null> => {
    try {
        return await prisma.user.findFirst({
            where: {
                email,
                passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};