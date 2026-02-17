# Project Mimosa

Multi-device sync demo: **Display** (3D Mimosa + robotic body) and **Controller** (dialogue UI). State is synced via Vercel KV (or in-memory mock when using `npm run dev`).

## Tech Stack

- React 18 + TypeScript + Vite
- @react-three/fiber + @react-three/drei + three
- React Router DOM
- Tailwind CSS
- Vercel KV (or Upstash Redis via Vercel)

## Scripts

- **`npm run dev`** — Start Vite dev server. `/api/state` is mocked in-memory (no Vercel needed).
- **`npm run build`** — Production build.
- **`npm run preview`** — Preview production build locally.

For real KV persistence, use **`vercel dev`** and configure a Vercel KV (or Redis) store in the Vercel project.

## Routes

- **`/`** or **`/controller`** — Controller UI (dialogue choices, state bars, small Mimosa preview). Use on iPad/mobile.
- **`/display`** — Full-screen 3D view only. Use on computer; polls state every 500ms.

## API

- **GET `/api/state`** — Returns current emotional state (trust, stress, openness, lastDialogue, timestamp).
- **POST `/api/state`** — Body: same shape; updates state in KV and returns the new state.

## Project structure

```
/src
  /pages     — Display.tsx, Controller.tsx
  /components — MimosaScene, MimosaHead, RoboticBody, DialoguePanel
  /hooks     — useMimosaState.ts (poll + post)
  /types     — index.ts
/api
  state.ts   — Vercel serverless GET/POST using Vercel KV
```

## Deploy

Deploy to Vercel; connect a KV or Redis store and set the required env vars so `api/state.ts` can use `@vercel/kv`.
