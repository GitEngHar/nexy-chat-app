// middleware.ts（テスト用）
import { NextResponse } from "next/server";

export function middleware(req: Request) {
    const url = new URL(req.url);
    // /chat 以下は無条件でサインイン画面へ
    if (url.pathname.startsWith("/chat")) {
        return NextResponse.redirect(
            new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(url.pathname)}`, url)
        );
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/chat/:path*"],
};
