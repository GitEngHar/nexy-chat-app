"use client";
import { useEffect, useState } from "react";
import MessageList, { ChatMessage } from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {useSession} from "next-auth/react";
export default function ChatDetail({ params }: { params: { id: string } }) {
    const threadId = params.id;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { data } = useSession();
    const authed = !!data?.user;
    useEffect(() => {
        // TODO; ちゃんと制御できない
        if (!authed) {redirect("/api/auth/signin?callbackUrl=/chat")} else {
            fetch(`/api/messages?threadId=${threadId}`).then(r=>r.json()).then((rows)=> {
                setMessages(rows.map((r:any)=>({ id: r.id, role: r.role, content: r.content })));
            });
        }
    }, [threadId]);

    async function send(text: string) {
        // 1) ユーザー発言を保存＆表示
        const user = { id: crypto.randomUUID(), role: "user" as const, content: text };
        setMessages(prev => [...prev, user]);
        await fetch("/api/messages", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ threadId, role:"user", content:text }) });

        // 2) Bot呼び出し
        const botRes = await fetch("/api/ai", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ threadId, content: text }) });
        const bot = await botRes.json(); // { role, content }

        // 3) Bot発言を保存＆表示
        const saved = await fetch("/api/messages", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ threadId, role:"assistant", content: bot.content }) });
        const savedMsg = await saved.json();
        setMessages(prev => [...prev, { id: savedMsg.id, role:"assistant", content: bot.content }]);
    }

    return (

        <main className="mx-auto flex h-dvh max-w-3xl flex-col gap-4 p-4">
            <div className="flex-1 rounded-2xl border p-4">
                <MessageList messages={messages} />
            </div>
            <ChatInput onSend={send} />
        </main>
    );
}
