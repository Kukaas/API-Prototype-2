import { createInventory } from './../inventory/inventory.server';
import { prisma } from "../utils/prisma.server";
import { createFinishedProduct } from '../finishedproduct/finishedproduct.server';
import { Prisma } from '@prisma/client';

type Production = {
    level: string
    productType: string
    quantity: number
    size: string | null
    status: string
    productionStartTime: Date
};

//GET ALL PRODUCTIONS
export const getProductions = async (): Promise<Production[]> => {
    try {
        return await prisma.production.findMany({
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                productionStartTime: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                },
            },
        });
    } catch (error) {
        console.error('Error fetching productions:', error);
        throw error; // re-throw the error to be handled by the caller or an error handler middleware
    }
};

//GET production by ID
export const getProductionById = async (id: string): Promise<Production | null> => {
    try {
        return await prisma.production.findUnique({
            where: { id },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                productionStartTime: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                },
            },
        });
    } catch (error) {
        console.error('Error fetching production by ID:', error);
        throw error;
    }
}


//CREATE PRODUCTION
export const createProduction = async (production: Prisma.ProductionCreateInput): Promise<Production> => {
    try {
        return await prisma.production.create({
            data: production,
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                productionStartTime: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                },
            },
        });
    } catch (error) {
        console.error('Error creating production:', error);
        throw error;
    }
};


//UPDATE PRODUCTION
export const updateProduction = async (id: string, production: Production): Promise<Production | undefined> => {
    try {
        const updatedProduction = await prisma.production.update({
            where: { id },
            data: {
                ...production,
                productionEndTime: production.status === 'COMPLETED' ? new Date() : null
            }, 
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                productionStartTime: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                },
            }
        });

        // If the status is COMPLETED, insert the finished product into the inventory
        if (updatedProduction.status === 'COMPLETED') {
            const finishedProduct = {
                level: updatedProduction.level,
                productType: updatedProduction.productType,
                quantity: updatedProduction.quantity,
                size: updatedProduction.size,
                user: {
                    connect: { id: updatedProduction.id }
                }
            };

            await createFinishedProduct(finishedProduct);
        };

        if (updatedProduction.status === 'COMPLETED') {
            await createInventory({
                level: updatedProduction.level,
                productType: updatedProduction.productType,
                quantity: updatedProduction.quantity,
                size: updatedProduction.size,
                status: updatedProduction.quantity > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK'
            })
        }

        return updatedProduction;
    } catch (error) {
        console.error('Error updating production:', error);
        throw error;
    }
}

    

//DELETE PRODUCTION
export const deleteProduction = async (id: string): Promise<Production> => {
    try {
        return await prisma.production.delete({
            where: { id },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                productionStartTime: true,
                userId: true,
                createdAt: true,
                updatedAt: true
            }
        });
    } catch (error) {
        console.error('Error deleting production:', error);
        throw error;
    }
}


//GET Production by User ID
export const getProductionByUserId = async (userId: string): Promise<Production[]> => {
    try {
        return await prisma.production.findMany({
            where: { userId },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                productionStartTime: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                },
            },
        });
    } catch (error) {
        console.error('Error fetching production by user ID:', error);
        throw error;
    }
}

//GET Production by User name
export const getProductionByUserName = async (name: string): Promise<Production[]> => {
    try {
        return await prisma.production.findMany({
            where: { 
                user: { 
                    name : {
                        startsWith: name,
                        mode: 'insensitive'
                    }
                } 
            },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                productionStartTime: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                },
            },
        });
    } catch (error) {
        console.error('Error fetching production by user name:', error);
        throw error;
    }
}