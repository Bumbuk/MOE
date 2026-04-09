# MOE

## Локальная база данных

Стандартный способ запуска PostgreSQL в репозитории:

```bash
docker compose up -d
```

Строка подключения для локальной разработки:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moe_store?schema=public"
```

## Полный старт с нуля

### Windows PowerShell

```powershell
npm install
Copy-Item .env.example .env
docker compose up -d
npm run prisma:generate
npm run prisma:migrate -- --name init
npx prisma db seed
npm run dev
```

### macOS / Linux

```bash
npm install
cp .env.example .env
docker compose up -d
npm run prisma:generate
npm run prisma:migrate -- --name init
npx prisma db seed
npm run dev
```

## Полезные команды

### Windows PowerShell

```powershell
docker compose down
npm run build
npm run lint
```

### macOS / Linux

```bash
docker compose down
npm run build
npm run lint
```
