# MOE

## Local database

Standard local PostgreSQL startup:

```bash
docker compose up -d
```

Connection string for local development:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moe_store?schema=public"
```

## Project start from scratch

```bash
npm install
Copy-Item .env.example .env
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npx prisma db seed
npm run dev
```

## Useful commands

```bash
docker compose down
npm run build
npm run lint
```
