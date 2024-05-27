import { prisma } from "../utils/prisma.server";

type Order = {
    studentNumber: string
    studentName: string
    gender: string
    status: string
    totalPrice?: number
    orderItems: OrderItem[] // Add orderItems property to the Order type
};

type OrderItem = {
    level: string
    productType: string
    quantity: number
    size: string
    unitPrice: number
    totalPrice: number
};

// GET ALL ORDERS
export const getOrders = async () => {
    return await prisma.order.findMany({
        select: {
            studentNumber: true,
            studentName: true,
            gender: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            updatedAt: true,
        },
        
    });
};

// GET ORDER BY ID
export const getOrderById = async (id: string) => {
    return await prisma.order.findUnique({
        where: {
            id: id
        },
        select: {
            studentNumber: true,
            studentName: true,
            gender: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}


// CREATE ORDER
export const createOrder = async (order: Order, orderItems: OrderItem[]) => {
    try {
        // Ensure each orderItem has a totalPrice property
        const itemsWithTotalPrice = orderItems.map(item => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice
        }));

        const totalPrice = itemsWithTotalPrice.reduce((acc, item) => acc + item.totalPrice, 0);

        return await prisma.order.create({
            data: {
                ...order,
                totalPrice,
                orderItems: {
                    create: itemsWithTotalPrice,
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
}