import { PrismaClient } from "@prisma/client";

// Next.js はホットリロードがあるので、開発中に PrismaClient を多重生成しないようにするパターン
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query"], // ← SQLログが見たければ残す
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
