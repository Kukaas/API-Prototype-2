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
                updatedAt: true
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
                updatedAt: true
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
        // First, search for an existing finished product item with the same level, productType, and size
        const existingProduct = await prisma.finishedProduct.findFirst({
            where: {
                level: finishedProduct.level,
                productType: finishedProduct.productType,
                size: finishedProduct.size,
            }
        });

        if (existingProduct) {
            throw new Error('Finished product already exists');
        }

        return await prisma.finishedProduct.create({
            data: {
                level: finishedProduct.level,
                productType: finishedProduct.productType,
                quantity: finishedProduct.quantity,
                size: finishedProduct.size
            }
        });
    } catch (error) {
        console.error('Error creating finished product:', error);
        throw error;
    }
}