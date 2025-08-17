export async function POST(req: Request) {
    const { content } = await req.json();
    return Response.json({ role: "assistant", content: `Echo: ${content}` });
}
