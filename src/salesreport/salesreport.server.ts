import { OrderItem } from '@prisma/client';
import { prisma } from '../utils/prisma.server'

type SalesReport = {
    level: string;
    productType: string;
    salesDate: Date;
    size: string | null;
    totalRevenue: number;
}

//CREATE SALES REPORT FROM ORDER ITEM
export const generateSalesReport = async (productType: string, level: string, size: string): Promise<SalesReport[]> => {
    try {
        const orderItems = await prisma.orderItem.findMany({
            where: {
                productType,
                level,
                size
            },
            select: {
                id: true,
                level: true,
                productType: true,
                quantity: true,
                size: true,
                unitPrice: true,
                totalPrice: true,
                orderId: true,
            }
        });

        const salesReport: SalesReport[] = [];

        for (const orderItem of orderItems) {
            // Fetch the most recent sales report for each product type, level, and size
            const recentReport = await prisma.salesReport.findFirst({
                where: {
                    productType: orderItem.productType,
                    level: orderItem.level,
                    size: orderItem.size
                },
            });

            // If a recent report exists, update it
            if (recentReport) {
                // Calculate the new total revenue
                const newTotalRevenue = recentReport.totalRevenue + orderItem.totalPrice;

                // Update the recent report
                const updatedReport = await prisma.salesReport.update({
                    where: { id: recentReport.id },
                    data: { totalRevenue: newTotalRevenue }
                });

                salesReport.push(updatedReport);
            }

            // If no recent report exists, create a new one
            else {
                const newReport = {
                    level: orderItem.level,
                    productType: orderItem.productType,
                    salesDate: new Date(),
                    size: orderItem.size,
                    totalRevenue: orderItem.totalPrice
                };

                salesReport.push(newReport);
            }
        }

    return salesReport;
    } catch (error) {
        console.error('Error generating sales report:', error);
        throw error;
    }
}
