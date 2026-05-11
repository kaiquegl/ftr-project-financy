# backend

Stack: **Bun** + **Elysia** + **GraphQL Yoga** + **bun:sqlite**

## Setup

```bash
bun install
```

## Development

```bash
bun run dev
```

## Production

```bash
bun run start
```

The GraphQL endpoint is available at `http://localhost:3000/graphql`.

## Environment variables

| Variable | Default   | Description                            |
|----------|-----------|----------------------------------------|
| `DB_PATH`| `dev.db`  | Path to the SQLite database file       |

Copy `.env.example` to `.env` and adjust as needed.

## SQLite

Uses Bun's built-in `bun:sqlite` module — no external driver needed. WAL mode and foreign keys are enabled by default in `src/lib/sqlite.ts`.
