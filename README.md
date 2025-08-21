ChatNote — Next.js + Prisma AI Chat
===================================

ChatNote is a minimal chat app built with the Next.js App Router, Prisma (SQLite), and NextAuth (Google). It supports creating chat threads, persisting messages, and generating AI replies using OpenAI. Without an API key, the AI route gracefully falls back to an echo response for local development.

Features
- Threads: Create and browse chat threads.
- Messages: Persist user and assistant messages per thread.
- Auth: Google sign‑in via NextAuth (protected `/chat/*`).
- AI replies: `/api/ai` composes context from prior messages and calls OpenAI.
- Local-friendly: Works without `OPENAI_API_KEY` using an echo fallback.

Project Structure
- `src/app/`: App Router pages, layouts, and API routes
  - `src/app/page.tsx`: Threads list and creation
  - `src/app/chat/[id]/page.tsx`: Chat UI for a thread
  - `src/app/api/chats/route.ts`: Threads CRUD (list/create)
  - `src/app/api/messages/route.ts`: Messages list/create
  - `src/app/api/ai/route.ts`: AI responses (OpenAI or echo)
  - `src/app/api/auth/[...nextauth]/route.ts`: NextAuth handler
- `src/components/`: Reusable UI (e.g., `MessageList`, `ChatInput`)
- `src/lib/db.ts`: Prisma client
- `prisma/`: Prisma schema, migrations, and local SQLite DB (`dev.db`)
- Root configs: `eslint.config.mjs`, `next.config.ts`, `tsconfig.json`, `middleware.ts`

Prerequisites
- Node.js 18+ and npm
- Google OAuth credentials (for NextAuth): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Optional: `OPENAI_API_KEY` for real AI replies

Environment Setup
Create `.env.local` in the project root with:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret

# Optional — enables real AI responses
OPENAI_API_KEY=sk-...
```

Tip: Generate a strong `NEXTAUTH_SECRET` using `openssl rand -base64 32`.

Database (Prisma + SQLite)
- Schema: `prisma/schema.prisma`
  - `ChatThread { id, title, createdAt }`
  - `Message { id, threadId, role, content, createdAt }`
- Local DB file: `prisma/dev.db`
- Commands:
  - `npx prisma generate` — generate Prisma client
  - `npx prisma migrate dev` — apply migrations locally
  - `npx prisma studio` — inspect data visually (optional)

Install, Run, and Build
- Install deps: `npm install`
- Dev server: `npm run dev` → http://localhost:3000
- Lint: `npm run lint`
- Production build: `npm run build` and `npm start`

Usage
1) Sign in: Visiting any `/chat/*` page triggers Google sign‑in.
2) Create a thread on the home page and open it.
3) Send a message; the app saves your message, calls `/api/ai`, then saves and displays the assistant’s reply.

AI Endpoint
- Route: `POST /api/ai`
- Request body: `{ threadId?: string, content: string, model?: string }`
- Behavior:
  - Loads up to 30 prior messages for context (if `threadId` provided).
  - Uses a concise system prompt and your latest user message.
  - Calls OpenAI Chat Completions with `model` (default: `gpt-4o-mini`).
  - If `OPENAI_API_KEY` is missing, returns `Echo: <content>`.
- Response: `{ role: "assistant", content: string }`

Key Files
- `src/app/chat/[id]/page.tsx`: Chat UI, posts to `/api/messages` and `/api/ai`.
- `src/app/api/ai/route.ts`: AI logic with OpenAI or echo fallback.
- `src/app/api/messages/route.ts`: Load and persist messages.
- `middleware.ts`: Redirects `/chat/*` to sign‑in.
- `src/auth.ts`: NextAuth config with Google provider.

Security & Configuration
- Keep secrets in `.env.local` and never commit them.
- Google OAuth callback URL should match NextAuth’s default: `/api/auth/callback/google`.
- The local SQLite DB (`prisma/dev.db`) is for development; consider a managed DB for production.

Roadmap
- Streaming responses (SSE) for token‑by‑token AI output.
- Memory improvements (larger context or vector recall).
- Per‑thread system prompt and model selection in UI.

License
- Private sample app. Add a license if you intend to distribute.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
