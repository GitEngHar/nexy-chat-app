"use client";
import { useEffect, useRef } from "react";

export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((m) => (
                <div
                    key={m.id}
                    className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                        m.role === "user"
                            ? "ml-auto bg-black text-white"
                            : "mr-auto bg-gray-100 text-gray-900"
                    }`}
                >
                    <p className="whitespace-pre-wrap text-sm leading-6">{m.content}</p>
                </div>
            ))}
            <div ref={endRef} />
        </div>
    );
}
