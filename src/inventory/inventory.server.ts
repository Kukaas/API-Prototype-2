import { prisma } from "../utils/prisma.server";

type Inventory = {
    level: string
    productType: string
    quantity: number
    size: string | null
    status: string
};

//GET ALL INVENTORIES
export const getInventories = async (): Promise<Inventory[]> => {
    try {
        return await prisma.inventory.findMany({
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                createdAt: true,
                updatedAt: true
            },
        });
    } catch (error) {
        console.error('Error fetching inventories:', error);
        throw error; // re-throw the error to be handled by the caller or an error handler middleware
    }
};

//GET inventory by ID
export const getInventoryById = async (id: string): Promise<Inventory | null> => {
    try {
        return await prisma.inventory.findUnique({
            where: { id },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                status: true,
                createdAt: true,
                updatedAt: true
            },
        });
    } catch (error) {
        console.error('Error fetching inventory by ID:', error);
        throw error;
    }
}

//CREATE INVENTORY
export const createInventory = async (inventory: Inventory): Promise<Inventory> => {
    try {
        // First, search for an existing inventory item with the same level, productType, and size
        const existingProduct = await prisma.inventory.findFirst({
            where: {
                level: inventory.level,
                productType: inventory.productType,
                size: inventory.size
            }
        });

        // If such an item exists, update it
        if (existingProduct) {
            const updatedProduct = await prisma.inventory.update({
                where: { id: existingProduct.id },
                data: {
                    quantity: existingProduct.quantity + inventory.quantity,
                }
            });
            return updatedProduct;
        }

        // If not, create a new one
        const newProduct = await prisma.inventory.create({
            data: {
                level: inventory.level,
                productType: inventory.productType,
                quantity: inventory.quantity,
                size: inventory.size,
                status: 'AVAILABLE'
            }
        });
        return newProduct;
    } catch (error) {
        console.error('Error creating or updating inventory:', error);
        throw error;
    }
}
