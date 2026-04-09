# AGENTS.md

## Роль агента
Ты реализуешь интернет-магазин строго по `PROJECT_PLAN.md`.

## Главные правила
1. Не отходить от архитектуры из `PROJECT_PLAN.md`.
2. Не переименовывать сущности без причины.
3. Не добавлять лишние библиотеки.
4. Не добавлять лишние таблицы.
5. Не смешивать UI, страницы и бизнес-логику.
6. Не хранить изображения в БД.
7. Не делать всё в одном файле.
8. Делать код чистым и предсказуемым.

## Обязательный стек
- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Zustand
- Zod
- React Hook Form

## Обязательная структура
- `src/app`
- `src/components`
- `src/lib`
- `src/store`
- `src/types`
- `prisma`
- `public/images/products`

## Разрешённые сущности БД на старте
- Category
- Product
- ProductColor
- ProductVariant
- ProductImage

## Запрещено добавлять на старте
- User
- Order
- CartItem в БД
- ProductCategory many-to-many
- Redux
- MongoDB
- отдельный backend
- микросервисы
- хранение изображений в БД

## Правила по коду
- Используй понятные имена файлов и функций.
- Не перегружай `page.tsx`.
- Выноси UI в `components`.
- Выноси работу с БД и серверную логику в `lib`.
- Prisma client держи отдельно в `lib/db.ts`.
- Типы держи отдельно в `types`.
- Корзину делай через Zustand store с persist.
- Валидацию делай через Zod.
- Формы готовь через React Hook Form.

## Правила по изображениям
- Файлы хранятся локально в `public/images/products/...`.
- В БД хранится только путь и метаданные.
- Формат путей должен быть стабильный и предсказуемый.

## Правила по реализации
Сначала сделать:
1. структуру проекта;
2. Prisma schema;
3. миграции;
4. Prisma client setup;
5. seed с 2–3 товарами;
6. базовые страницы;
7. базовые компоненты;
8. Zustand cart store.

## Приоритет
Если есть конфликт между удобством и архитектурой — выбирать архитектуру из `PROJECT_PLAN.md`.


## Git workflow for Codex
- After every completed and verified change, run the relevant checks/tests locally.
- Only commit changes that pass the checks and keep the project runnable.
- Push each completed working change to GitHub immediately after a successful local verification.
- Do not accumulate many untested edits into one large commit.
- If a change breaks the project, fix it first, then commit and push only the working state.
- Use small, clear commit messages that describe exactly what was changed.
https://github.com/Bumbuk/MOE
