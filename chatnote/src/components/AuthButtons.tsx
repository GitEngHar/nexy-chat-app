// components/AuthButtons.tsx
"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
    const { data } = useSession();
    const authed = !!data?.user;

    return authed ? (
        <button onClick={() => signOut()} className="rounded-xl bg-black px-3 py-2 text-white">
            Sign out
        </button>
    ) : (
        <button onClick={() => signIn("google")} className="rounded-xl bg-black px-3 py-2 text-white">
            Sign in with Google
        </button>
    );
}
