-- AlterTable
ALTER TABLE "Product" ADD COLUMN "popular" INTEGER;
ALTER TABLE "Product" ADD COLUMN "preview" INTEGER;

-- CreateIndex
CREATE INDEX "Product_popular_idx" ON "Product"("popular");

-- CreateIndex
CREATE INDEX "Product_preview_idx" ON "Product"("preview");
