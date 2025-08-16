import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const threads = await prisma.chatThread.findMany({
        orderBy: { createdAt: "desc" }, include: { _count: { select: { messages: true } } }
    });
    return NextResponse.json(threads);
}

export async function POST(req: Request) {
    const { title } = await req.json();
    const th = await prisma.chatThread.create({ data: { title } });
    return NextResponse.json(th, { status: 201 });
}
