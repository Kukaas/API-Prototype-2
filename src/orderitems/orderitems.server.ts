import { prisma } from "../utils/prisma.server";

type OrderItems = {
    level: string
    productType: string
    quantity: number
    size?: string | null
    unitPrice: number
    totalPrice: number
}

//GET orderitems
export const getOrderItems = async (): Promise<OrderItems[]> => {
    try {
        return await prisma.orderItem.findMany({
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                unitPrice: true,
                totalPrice: true,
                order: {
                    select:{
                        id: true,
                    }
                }
            },
            
        });
    } catch (error) {
        console.error('Error fetching orderitems:', error);
        return [];
    }
};

//GET orderitem by ID
export const getOrderItemById = async (id: string): Promise<OrderItems | null> => {
    try {
        return await prisma.orderItem.findUnique({
            where: { id },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                unitPrice: true,
                totalPrice: true,
                order: {
                    select:{
                        id: true,
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error fetching orderitem:', error);
        return null;
    }
};

//GET order items by order ID
export const getOrderItemsByOrderId = async (orderId: string): Promise<OrderItems[]> => {
    try {
        return await prisma.orderItem.findMany({
            where: { orderId },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                unitPrice: true,
                totalPrice: true,
                order: {
                    select:{
                        id: true,
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error fetching order items:', error);
        return [];
    }
};