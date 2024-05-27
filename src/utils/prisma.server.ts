import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
    var prisma: PrismaClient;
}

if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
}

prisma = globalThis.prisma;

export {prisma};