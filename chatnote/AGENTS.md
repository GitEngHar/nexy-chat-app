# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router pages, layouts, and API routes (e.g., `src/app/api/chats/route.ts`).
- `src/components/`: Reusable UI components (e.g., `MessageList.tsx`).
- `src/lib/`: Runtime utilities (e.g., `db.ts` for Prisma client).
- `prisma/`: Prisma schema, migrations, and local SQLite DB (`dev.db`).
- `public/`: Static assets.
- Root configs: `eslint.config.mjs`, `next.config.ts`, `tsconfig.json`, `middleware.ts`.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js dev server at `http://localhost:3000`.
- `npm run build`: Production build.
- `npm start`: Run the built app.
- `npm run lint`: Lint using Next/ESLint config.
- Prisma (as needed): `npx prisma migrate dev`, `npx prisma generate`, `npx prisma studio`.

## Coding Style & Naming Conventions
- Language: TypeScript with `strict: true` (see `tsconfig.json`).
- Imports: Use path alias `@/*` for files under `src/`.
- Components: PascalCase (e.g., `ChatInput.tsx`). Hooks/utilities: camelCase.
- Routes/segments: lowercase (e.g., `src/app/chat/[id]/page.tsx`).
- Linting: Fix issues or add minimal justifications; run `npm run lint` locally.

## Testing Guidelines
- No test framework is configured. If adding tests, prefer colocated `*.test.ts(x)` files under `src/` (e.g., `src/components/MessageList.test.tsx`).
- Aim for meaningful coverage of API routes and components (render, props, and edge cases). Keep tests deterministic.

## Commit & Pull Request Guidelines
- Commits: Clear, imperative subject (e.g., "Add chat search filter"). Optional scope (e.g., `api:` or `ui:`).
- PRs: Include purpose, key changes, screenshots for UI, and steps to verify. Link issues (`Closes #123`). Note schema changes (`prisma migrate`) and ENV impacts.

## Security & Configuration Tips
- Environment: Use `.env.local` for secrets (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`). Do not commit secrets.
- Database: Local dev uses SQLite at `prisma/dev.db`. Regenerate client after schema edits.

## Architecture Overview
- Next.js App Router with server and client components. 
- API routes under `src/app/api/*` for threads, messages, and bot echo.
- Data layer: Prisma models `ChatThread` and `Message` with relational access.

## AI Chat Feature
- src/app/api/ai/route.ts handles AI responses.
- It calls the LLM API using OPENAI_API_KEY (or other backends).
- The client UI (ChatInput, MessageList) renders user + AI messages in real time.

## Future Extensions (for codex):

- Add memory per chat thread (store conversation history in DB).
- Enable streaming responses (Server-Sent Events / WebSocket).