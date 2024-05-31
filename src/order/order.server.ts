import { generateSalesReport } from './../salesreport/salesreport.server';
import { prisma } from "../utils/prisma.server";

type Order = {
    studentNumber: string
    studentName: string
    contactNumber: string
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

        console.log("Order: ", order);
        console.log("Order Items: ", itemsWithTotalPrice);

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
        console.error("Error creating order:", error);
        throw error;
    }
};

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
                    // Calculate the new quantity
                    const newQuantity = inventoryItem.quantity - item.quantity;

                    // Update the quantity of the inventory item
                    await prisma.inventory.update({
                        where: { id: inventoryItem.id },
                        data: { 
                            quantity: inventoryItem.quantity - item.quantity,
                            status: newQuantity === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE'
                        }
                    });
                }
                // Fetch the most recent sales report for each product type, level, and size
                const recentReport = await prisma.salesReport.findFirst({
                    where: {
                        productType: item.productType,
                        level: item.level,
                        size: item.size
                    },
                });

                // If a recent report exists, update it
                if (recentReport) {
                    // Calculate the new total revenue
                    const newTotalRevenue = recentReport.totalRevenue + item.totalPrice;

                    // Update the recent report
                    await prisma.salesReport.update({
                        where: { id: recentReport.id },
                        data: { totalRevenue: newTotalRevenue }
                    });
                }

                // If no recent report exists, create a new one
                else {
                    const totalPrice = item.quantity * item.unitPrice;
                    // Create a new sales report
                    await prisma.salesReport.create({
                        data: {
                            productType: item.productType,
                            level: item.level,
                            size: item.size,
                            totalRevenue: totalPrice,
                            salesDate: new Date()
                        }
                    });
                }
            }
        }
    
        return order;
    } catch (error) {
        console.error(error);
    }
}


// DELETE ORDER
export const deleteOrder = async (id: string) => {
    try {
        // First delete the OrderItem records
        await prisma.orderItem.deleteMany({
            where: {
                orderId: id
            }
        });

        // Then delete the Order
        return await prisma.order.delete({
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
            }
        });
    } catch (error) {
        console.error(error);
    }
}