"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Thread = { id: string; title: string; _count?: { messages: number } };

export default function Home() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [title, setTitle] = useState("");

    useEffect(() => { fetch("/api/chats").then(r => r.json()).then(setThreads); }, []);

    async function addThread(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/chats", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ title }) });
        const th = await res.json();
        setThreads(prev => [th, ...prev]); setTitle("");
    }

    return (
        <main className="mx-auto max-w-3xl p-6 space-y-6">
            <h1 className="text-2xl font-bold">ChatNote</h1>
            <form onSubmit={addThread} className="flex gap-2">
                <input className="flex-1 rounded-xl border p-2" value={title} onChange={e => setTitle(e.target.value)}
                       placeholder="New thread title" required/>
                <button className="rounded-xl bg-black px-4 py-2 text-white">Add</button>
            </form>
            <ul className="space-y-2">
                {threads.map(t => (
                    <li key={t.id} className="rounded-xl border p-3 hover:bg-gray-50">
                        <Link href={`/chat/${t.id}`} className="font-medium underline">{t.title}</Link>
                        <span className="ml-2 text-sm text-gray-500">{t._count?.messages ?? 0} msgs</span>
                    </li>
                ))}
            </ul>
        </main>
    );
}
