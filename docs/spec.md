## Summary
EchoBot is a minimal Telegram bot that offers three commands: /start (greeting), /echo <text> (replies with the same text and increments a global counter), and /count (returns a GLOBAL total of how many echoes the bot has served). There is no per-user state, no external APIs, and no additional features.

## Audience
Any Telegram user who wants a simple echo service and a global count of echoes served. Intended for easy deployment and low maintenance.

## Core entities
- Global counter: a single persisted integer shared across all users and chats, representing total successful /echo operations.
- Commands: /start, /echo, /count.

## Integrations & notification targets
- Telegram Bot API only. No external APIs, no notification targets (no webhooks to other services).

## Interaction flows
1. /start
   - User sends: /start
   - Bot replies: brief greeting text (e.g. "Hello — send /echo <text> to echo. Use /count to see total echoes served.").
   - No state changes.

2. /echo <text>
   - User sends: /echo followed by text (single space after command). Example: `/echo hello world`
   - If <text> is present:
     - Atomically increment global counter in persistent store.
     - Bot replies with the exact same text (preserve content as plain text).
   - If <text> is missing (user sent `/echo` only):
     - Bot replies with usage hint: `Usage: /echo <text>`.
     - Do NOT increment the counter.

3. /count
   - User sends: /count
   - Bot replies: the current global total (numeric) and a short message, e.g. `Total echoes served: 123`.

Notes on message handling
- Only commands are required. Non-command messages are ignored (no echoing unless via /echo).
- The bot will respond to commands in private chats and groups according to Telegram privacy mode defaults.

## Persistence
- Store a single SQLite database file (default path: /data/echoes.db).
- Schema: table `counter` with columns (id INTEGER PRIMARY KEY CHECK(id=1), total INTEGER NOT NULL).
- On first run, create the table and insert row id=1, total=0.
- Increment operation: perform an atomic SQL UPDATE inside a transaction (e.g. `UPDATE counter SET total = total + 1 WHERE id = 1; SELECT total FROM counter WHERE id = 1;`) or use `RETURNING` if supported, ensuring the increment is atomic to avoid lost increments.
- Enable WAL mode and use short transactions for concurrency safety when run as a single instance.

## Deployment & runtime
- Default implementation: Python 3 (recommended 3.11) using python-telegram-bot v20+.
- Run with long polling (no webhook) by default to minimize infra requirements.
- TELEGRAM token supplied via environment variable `TELEGRAM_TOKEN`.
- Provide a Dockerfile for containerized deployment; logs to stdout/stderr.
- Health: process exits nonzero on fatal DB or API errors; container should be restarted by host orchestrator if desired.

## Payments
- No payments, billing, or monetization features.

## Non-goals
- No per-user or per-chat counters or history.
- No admin panel, no metrics dashboard, no external storage or APIs.
- No horizontal scaling guarantees across multiple instances using separate local DBs (single-instance default). To scale horizontally would require changing persistence to an external DB (out of scope).

## Assumptions & defaults
- Language & framework: Python 3.11 with python-telegram-bot v20 — common, well-supported, minimal dependencies.
- Runtime mode: long polling by default — simpler deployment (no public HTTPS endpoint required).
- Bot token source: environment variable `TELEGRAM_TOKEN` — standard secure practice for credentials.
- Persistence: SQLite file `/data/echoes.db` with a single-row `counter` table — simple, zero-dependency persistent store sufficient for a global counter.
- Concurrency: use SQLite WAL and short transactions / atomic UPDATEs to avoid lost increments when running a single instance — safe and simple for expected scale.
- Error handling: invalid /echo usage returns a usage hint and does not increment — prevents accidental count inflation.
- Deployment artifact: include a Dockerfile and run as a single container exposing no external HTTP endpoints — easy to deploy and reproduce.
- Logging: structured plain-text logs to stdout/stderr — compatible with container platforms and simple debugging.

This brief contains all decisions required to implement and deploy EchoBot as specified. Build should implement the commands, persistence, and deployment defaults above; no further clarifications required.