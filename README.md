# MOE

## Локальная база данных

Стандартный способ запуска PostgreSQL в репозитории:

```bash
docker compose up -d
```

Строка подключения для локальной разработки:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moe_store?schema=public"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
```

`TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` нужны для уведомлений о новых заказах. Если они не заданы, заказ всё равно сохранится в базе, а ошибка отправки уведомления будет залогирована на сервере.

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

## Оформление заказа

После запуска проекта:

1. Добавьте товар в корзину из карточки товара.
2. Перейдите в `/cart`.
3. Заполните форму оформления заказа.
4. После успешной отправки корзина очистится, а на странице появится номер заказа.

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
