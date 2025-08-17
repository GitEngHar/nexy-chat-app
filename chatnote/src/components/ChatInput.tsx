"use client";
import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (text: string) => Promise<void> }) {
    const [text, setText] = useState("");
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim() || pending) return;
        setPending(true);
        await onSend(text);
        setText("");
        setPending(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 border rounded-2xl p-2">
            <input
                className="flex-1 outline-none px-2"
                placeholder="Type a message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                type="submit"
                disabled={pending || !text.trim()}
                className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50"
            >
                Send
            </button>
        </form>
    );
}
