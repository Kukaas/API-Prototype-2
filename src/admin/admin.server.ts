import { prisma } from "../utils/prisma.server";

type Admin = {
    name: string;
    email: string;
    passwordHash: string;
    birthDate: Date;
    address: string | null;
    contactNumber: string | null;
}

//GET all admins
export const getAdmins = async (): Promise<Admin[]> => {
    try {
        return prisma.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true
            }
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw error;
    }
};

//GET admin by ID
export const getAdminById = async (id: string): Promise<Admin | null> => {
    try {
        return prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true
            }
        });
    } catch (error) {
        console.error('Error fetching admin by ID:', error);
        throw error;
    }
}

//CREATE admin
export const createAdmin = async (admin: Admin): Promise<Admin> => {
    try {
        return prisma.admin.create({
            data: {
                name: admin.name,
                email: admin.email,
                passwordHash: admin.passwordHash,
                birthDate: admin.birthDate,
                address: admin.address,
                contactNumber: admin.contactNumber
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true
            }
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        throw error;
    }
}

//UPDATE admin
export const updateAdmin = async (id: string, admin: Admin): Promise<Admin | null> => {
    try {
        return prisma.admin.update({
            where: { id },
            data: {
                name: admin.name,
                email: admin.email,
                passwordHash: admin.passwordHash,
                birthDate: admin.birthDate,
                address: admin.address,
                contactNumber: admin.contactNumber
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                birthDate: true,
                address: true,
                contactNumber: true
            }
        });
    } catch (error) {
        console.error('Error updating admin:', error);
        throw error;
    }
}