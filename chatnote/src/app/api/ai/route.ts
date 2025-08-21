import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Role = "user" | "assistant" | "system";

export async function POST(req: Request) {
  try {
    const { threadId, content, model }: { threadId?: string; content?: string; model?: string } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Missing 'content'" }, { status: 400 });
    }

    // Build conversation history from DB (if threadId provided)
    const history = threadId
      ? await prisma.message.findMany({
          where: { threadId },
          orderBy: { createdAt: "asc" },
          take: 30,
        })
      : [];

    const messages: { role: Role; content: string }[] = [];

    // Optional system primer
    messages.push({
      role: "system",
      content:
        "You are ChatNote AI. Be concise, helpful, and accurate. Format responses as plain text.",
    });

    // Add past convo (user/assistant only)
    for (const m of history) {
      const r = m.role === "user" || m.role === "assistant" ? (m.role as Role) : ("user" as Role);
      messages.push({ role: r, content: m.content });
    }

    // Latest user message
    messages.push({ role: "user", content });

    const apiKey = process.env.OPENAI_API_KEY;

    // Fallback when no API key: simple echo
    if (!apiKey) {
      return NextResponse.json({ role: "assistant", content: `Echo: ${content}` });
    }

    // Call OpenAI Chat Completions via fetch to avoid extra deps
    const usedModel = model || "gpt-4o-mini";
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: usedModel,
        messages,
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const err = await safeJson(resp);
      return NextResponse.json(
        { error: "Upstream error", detail: err },
        { status: 502 }
      );
    }

    const data = (await resp.json()) as any;
    const ai = data.choices?.[0]?.message?.content?.trim() || "(no content)";

    return NextResponse.json({ role: "assistant", content: ai });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}

async function safeJson(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return { status: resp.status, statusText: resp.statusText };
  }
}

