# @agntdev/bot-toolkit

The opinionated grammY toolkit AGNTDEV-generated Telegram bots are built on.
It exists so every generated bot shares **one** structure: the Dev-stage codegen
targets this API, and the test harness replays Telegram Updates against bots
built here (see `docs/pivot`).

## What's in it

- **Curated SDK** — `createBot(token, { initial, storage?, onError? })`: a grammY
  `Bot` pre-wired with session middleware and an error boundary.
- **UI-kit** (`src/ui/keyboard.ts`) — pure inline-keyboard builders:
  `inlineButton`, `urlButton`, `inlineKeyboard`, `menuKeyboard`, `confirmKeyboard`,
  `paginate`. They return plain `InlineKeyboardMarkup` objects (no runtime grammY
  dependency) so they are fully unit-testable and assertable by the harness.
- **Session persistence** — `createBot` auto-selects storage: **Redis**
  (`src/session/redis.ts`, `RedisSessionStorage` over `ioredis`) when `REDIS_URL`
  is set in the environment, else in-memory (`src/session/memory.ts`,
  `MemorySessionStorage`). Both implement grammY's `StorageAdapter`. Generated
  bots need ZERO storage code — the platform provisions Redis and injects
  `REDIS_URL`; pass an explicit `storage` to override. Redis state is recyclable.
- **Runtime image** (`templates/Dockerfile`) — node:20-alpine build/run template
  for a generated bot. `BOT_TOKEN` is injected at runtime, never baked.

## Scripts

```
npm run typecheck   # tsc --noEmit against grammY
npm test            # vitest (UI-kit + session)
npm run build       # tsc → dist/ (declarations included)
```

Toolkit choice rationale (grammY/TS): `docs/pivot/01-gap-analysis.md` §B.
