"use client";
import AuthButtons from "@/components/AuthButtons";

export default function Header() {
    return (
        <header className="flex items-center justify-between border-b p-4">
            <h1 className="font-bold">ChatNote</h1>
            <AuthButtons />
        </header>
    );
}
