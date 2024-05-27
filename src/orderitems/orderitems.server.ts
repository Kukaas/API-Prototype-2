import { prisma } from "../utils/prisma.server";

type Orderitem = {
    level: string
    productType: string
    quantity: number
    size: string
    unitPrice: number
    totalPrice: number
};

// GET ALL ORDERITEMS
export const getOrderitems = async () => {
    return await prisma.orderItem.findMany({
        select: {
            level: true,
            productType: true,
            quantity: true,
            size: true,
            unitPrice: true,
            totalPrice: true
        },
        
    });
}; 

// GET ORDERITEM BY ID
export const getOrderitemById = async (id: string) => {
    return await prisma.orderItem.findUnique({
        where: {
            id: id
        },
        select: {
            level: true,
            productType: true,
            quantity: true,
            size: true,
            unitPrice: true,
            totalPrice: true
        }
    });
};
