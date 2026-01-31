-- SQLite init migration (single source of truth)
PRAGMA foreign_keys=OFF;

-- Product
CREATE TABLE "Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT,
  "description" TEXT NOT NULL DEFAULT "",
  "status" TEXT NOT NULL DEFAULT "ACTIVE",
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- ProductColor
CREATE TABLE "ProductColor" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "ProductColor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ProductColor_productId_slug_key" ON "ProductColor"("productId","slug");
CREATE INDEX "ProductColor_productId_sortOrder_idx" ON "ProductColor"("productId","sortOrder");

-- Variant
CREATE TABLE "Variant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "colorId" TEXT NOT NULL,
  "size" TEXT NOT NULL,
  "sizeSort" INTEGER NOT NULL,
  "sku" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT "ACTIVE",
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Variant_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "ProductColor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Variant_sku_key" ON "Variant"("sku");
CREATE UNIQUE INDEX "Variant_colorId_size_key" ON "Variant"("colorId","size");
CREATE INDEX "Variant_colorId_idx" ON "Variant"("colorId");
CREATE INDEX "Variant_sizeSort_idx" ON "Variant"("sizeSort");
CREATE INDEX "Variant_size_idx" ON "Variant"("size");
CREATE INDEX "Variant_status_idx" ON "Variant"("status");

-- Image
CREATE TABLE "Image" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "colorId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "alt" TEXT NOT NULL DEFAULT "",
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "Image_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "ProductColor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Image_colorId_sortOrder_idx" ON "Image"("colorId","sortOrder");

-- Order
CREATE TABLE "Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT "NEW",
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "comment" TEXT,
  "deliveryMethod" TEXT NOT NULL,
  "deliveryAddress" TEXT,
  "deliveryPrice" INTEGER NOT NULL DEFAULT 0,
  "subtotal" INTEGER NOT NULL,
  "total" INTEGER NOT NULL
);

-- OrderItem
CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "variantId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "color" TEXT,
  "size" TEXT NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "qty" INTEGER NOT NULL,
  "linePrice" INTEGER NOT NULL,
  CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
