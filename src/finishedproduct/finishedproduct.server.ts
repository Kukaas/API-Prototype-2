import { prisma } from "../utils/prisma.server";

type FinishedProduct = {
    level: string
    productType: string
    quantity: number
    size: string | null
};

//GET ALL FINISHED PRODUCTS
export const getFinishedProducts = async (): Promise<FinishedProduct[]> => {
    try {
        return await prisma.finishedProduct.findMany({
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error fetching finished products:', error);
        throw error; // re-throw the error to be handled by the caller or an error handler middleware
    }
};

//GET finished product by ID
export const getFinishedProductById = async (id: string): Promise<FinishedProduct | null> => {
    try {
        return await prisma.finishedProduct.findUnique({
            where: { id },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error fetching finished product by ID:', error);
        throw error;
    }
}

//CREATE FINISHED PRODUCT
export const createFinishedProduct = async (finishedProduct: FinishedProduct): Promise<FinishedProduct> => {
    try {
        const existingProduct = await prisma.finishedProduct.findFirst({
            where: {
                productType: finishedProduct.productType,
                level: finishedProduct.level,
                size: finishedProduct.size,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (existingProduct) {
            // Update the quantity of the existing product
            return await prisma.finishedProduct.update({
                where: {
                    id: existingProduct.id,
                },
                data: {
                    quantity: finishedProduct.quantity + existingProduct.quantity,
                },
            });
        } else {
            // Create a new finished product
            return await prisma.finishedProduct.create({
                data: {
                    level: finishedProduct.level,
                    productType: finishedProduct.productType,
                    quantity: finishedProduct.quantity,
                    size: finishedProduct.size,
                },
                select: {
                    id: true,
                    level: true,
                    productType: true,
                    quantity: true,
                    size: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true
                        }
                    }
                },
            });
        }
    } catch (error) {
        console.error('Error creating finished product:', error);
        throw error;
    }
}

//UPDATE FINISHED PRODUCT
export const updateFinishedProduct = async (id: string, finishedProduct: FinishedProduct): Promise<FinishedProduct | null> => {
    try {
        const existingProduct = await prisma.finishedProduct.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return null;
        }

        return await prisma.finishedProduct.update({
            where: { id },
            data: {
                level: finishedProduct.level,
                productType: finishedProduct.productType,
                quantity: finishedProduct.quantity,
                size: finishedProduct.size,
            },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error updating finished product:', error);
        throw error;
    }
}

//DELETE FINISHED PRODUCT
export const deleteFinishedProduct = async (id: string): Promise<FinishedProduct | null> => {
    try {
        const existingProduct = await prisma.finishedProduct.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return null;
        }

        await prisma.finishedProduct.delete({
            where: { id },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            },
        });

        return existingProduct;
    } catch (error) {
        console.error('Error deleting finished product:', error);
        throw error;
    }
}

//GET Finished Product by User ID
export const getFinishedProductByUserId = async (userId: string): Promise<FinishedProduct[]> => {
    try {
        return await prisma.finishedProduct.findMany({
            where: { userId },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error fetching finished products by user ID:', error);
        throw error;
    }
}