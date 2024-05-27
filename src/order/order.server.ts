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
            id: true,
            studentNumber: true,
            studentName: true,
            gender: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            updatedAt: true,
            orderItems: {
                select: {
                    level: true,
                    productType: true,
                    quantity: true,
                    size: true,
                    unitPrice: true,
                    totalPrice: true,
                }
            }
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
            id: true,
            studentNumber: true,
            studentName: true,
            gender: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            updatedAt: true,
            orderItems: {
                select: {
                    level: true,
                    productType: true,
                    quantity: true,
                    size: true,
                    unitPrice: true,
                    totalPrice: true,
                }
            }
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
            select: {
                id: true,
                studentNumber: true,
                studentName: true,
                gender: true,
                status: true,
                totalPrice: true,
                createdAt: true,
                updatedAt: true,
                orderItems: {
                    select: {
                        level: true,
                        productType: true,
                        quantity: true,
                        size: true,
                        unitPrice: true,
                        totalPrice: true,
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// UPDATE ORDER
export const updateOrder = async (id: string, order: Order, orderItems: OrderItem[]) => {
    try {
        // Ensure each orderItem has a totalPrice property
        const itemsWithTotalPrice = orderItems.map(item => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice
        }));
        
        const totalPrice = itemsWithTotalPrice.reduce((acc, item) => acc + item.totalPrice, 0);
        
        const updatedOrder = await prisma.order.update({
            where: {
                id: id
            },
            data: {
                studentName: order.studentName,
                studentNumber: order.studentNumber,
                gender: order.gender,
                status: order.status,
                totalPrice: totalPrice,   
            },
            include: {
                orderItems: true
            }
        });
    
        if (updatedOrder.status === 'CLAIMED') {
            for (const item of order.orderItems) {
                const inventoryItem = await prisma.inventory.findFirst({
                    where: {
                        productType: item.productType,
                        size: item.size,
                        level: item.level
                    }
                });
    
                if (!inventoryItem) {
                    console.log(`No inventory item found for productType: ${item.productType}, size: ${item.size}, level: ${item.level}`);
                } else {
                    // Update the quantity of the inventory item
                    await prisma.inventory.update({
                        where: { id: inventoryItem.id },
                        data: { quantity: inventoryItem.quantity - item.quantity }
                    });
                }
            }

            // Delete all orderItems associated with the order
            await prisma.orderItem.deleteMany({
                where: {
                    orderId: id
                }
            });
        }
    
        return order;
    } catch (error) {
        console.error(error);
    }
}