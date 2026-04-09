# PROJECT_PLAN.md

## Цель проекта
Собрать красивый и понятный интернет-магазин без лишней сложности.

### Страницы
- Главная
- Каталог
- Карточка товара
- О нас
- Корзина

## Стек
- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Zustand
- Zod
- React Hook Form

## Что важно
- чистая архитектура;
- понятная структура папок;
- минимум лишних сущностей;
- изображения хранятся локально на диске;
- в БД хранятся только данные и пути к изображениям.

## Что не делать
- не добавлять Redux;
- не использовать MongoDB;
- не делать отдельный backend;
- не хранить изображения в БД;
- не добавлять микросервисы;
- не плодить лишние таблицы.

## Структура проекта
```text
src/
  app/
    (store)/
      page.tsx
      catalog/
        page.tsx
      product/
        [slug]/
          page.tsx
      about/
        page.tsx
      cart/
        page.tsx
    api/
      products/
        route.ts
    layout.tsx
    globals.css

  components/
    layout/
    ui/
    home/
    catalog/
    product/
    cart/

  lib/
    db.ts
    utils.ts
    format.ts
    products.ts
    images.ts
    validations/
      product.ts
      order.ts

  store/
    cart-store.ts

  types/
    product.ts
    cart.ts
    common.ts

prisma/
  schema.prisma
  migrations/

public/
  images/
    products/
```

## Архитектурные правила
1. `app/` — только страницы и маршруты.
2. `components/` — только UI и составные блоки.
3. `lib/` — БД, утилиты, серверная логика, форматирование.
4. `store/` — Zustand store.
5. `types/` — типы.
6. `prisma/` — схема и миграции.
7. `public/images` — локальные изображения.
8. `page.tsx` не должен быть перегружен логикой.

## Минимальная модель БД

### Category
- id
- slug
- name
- description?

### Product
- id
- slug
- title
- description
- shortDescription
- status
- composition
- certification
- popularRank
- previewRank
- categoryId
- createdAt
- updatedAt

### ProductColor
- id
- productId
- slug
- name
- sortOrder

### ProductVariant
- id
- productColorId
- size
- sku
- price
- oldPrice?
- stock
- status

### ProductImage
- id
- productId
- productColorId?
- path
- alt
- sortOrder
- isMain

## Что пока не добавлять
- User
- Order
- CartItem в БД
- ProductCategory many-to-many

## Изображения
Храним локально.

Пример структуры:
```text
public/
  images/
    products/
      product-slug/
        color-slug/
          1.webp
          2.webp
```

В БД храним только:
- `path`
- `alt`
- `sortOrder`
- `isMain`
- связь с товаром/цветом

Пример `path`:
```text
/images/products/bomber/banana/1.webp
```

## Корзина
- реализуется через Zustand;
- хранение на клиенте;
- persist в localStorage;
- в БД корзину пока не переносить.

## Импорт данных
Источник данных на старте:
- CSV / Excel / JSON

Схема:
1. Prisma migrations создают структуру БД.
2. Seed или import script загружает категории, товары, цвета, варианты, изображения.
3. Картинки кладутся вручную в `public/images/products/...`.
4. В БД пишутся только пути.

## Definition of Done для стартовой версии
Нужно получить:
- рабочий проект на Next.js;
- подключённый PostgreSQL;
- Prisma schema и миграции;
- главную страницу;
- каталог;
- карточку товара;
- страницу О нас;
- корзину;
- базовые компоненты;
- 2–3 seed товара для проверки.


## Git workflow for Codex
- After every completed and verified change, run the relevant checks/tests locally.
- Only commit changes that pass the checks and keep the project runnable.
- Push each completed working change to GitHub immediately after a successful local verification.
- Do not accumulate many untested edits into one large commit.
- If a change breaks the project, fix it first, then commit and push only the working state.
- Use small, clear commit messages that describe exactly what was changed.
