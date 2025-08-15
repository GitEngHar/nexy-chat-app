"use client";
import { useState } from "react";
import MessageList, { ChatMessage } from "./components/MessageList";
import ChatInput from "./components/ChatInput";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: crypto.randomUUID(), role: "assistant", content: "Hi! なんでも聞いてね。" },
  ]);

  async function send(text: string) {
    // 楽観的にユーザー発言を表示
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);

    // Bot（エコー）呼び出し
    const res = await fetch("/api/bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    const bot = (await res.json()) as { role: "assistant"; content: string };
    setMessages(prev => [...prev, { id: crypto.randomUUID(), ...bot }]);
  }

  return (
      <main className="mx-auto flex h-dvh max-w-3xl flex-col gap-4 p-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold">ChatNote – Minimal</h1>
        </header>

        <div className="flex-1 rounded-2xl border p-4">
          <MessageList messages={messages} />
        </div>

        <ChatInput onSend={send} />
      </main>
  );
}
