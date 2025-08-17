import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const threadId = new URL(req.url).searchParams.get("threadId")!;
    const msgs = await prisma.message.findMany({
        where: { threadId }, orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(msgs);
}

export async function POST(req: Request) {
    const { threadId, role, content } = await req.json();
    const msg = await prisma.message.create({ data: { threadId, role, content } });
    return NextResponse.json(msg, { status: 201 });
}
