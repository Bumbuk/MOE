import fs from "node:fs";
import path from "node:path";
import { prisma } from "../../lib/db";

const ROOT = path.join(process.cwd(), "public", "images", "products");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function listDirs(p: string) {
  if (!fs.existsSync(p)) return [];
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function listImageFiles(p: string) {
  if (!fs.existsSync(p)) return [];
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => f.name)
    .filter((name) => ALLOWED.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "ru")); // стабильный порядок
}

async function main() {
  if (!fs.existsSync(ROOT)) {
    throw new Error(`Нет папки: ${ROOT}`);
  }

  // Берём все товары и их цвета из БД
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      colors: { select: { id: true, slug: true } },
    },
  });

  const productBySlug = new Map(products.map((p) => [p.slug.toLowerCase(), p]));
  const stats = { scannedColors: 0, createdImages: 0, skippedNoColorInDb: 0 };

  // art001, art009, bomber, ...
  const productDirs = listDirs(ROOT);

  await prisma.$transaction(async (tx) => {
    for (const prodSlugRaw of productDirs) {
      const prodSlug = prodSlugRaw.toLowerCase();
      const prod = productBySlug.get(prodSlug);
      if (!prod) {
        console.warn(`⚠️ В папках есть продукт "${prodSlugRaw}", но в БД его нет. Пропуск.`);
        continue;
      }

      const colorDirs = listDirs(path.join(ROOT, prodSlugRaw));
      const colorBySlug = new Map(prod.colors.map((c) => [c.slug.toLowerCase(), c]));

      for (const colorSlugRaw of colorDirs) {
        const colorSlug = colorSlugRaw.toLowerCase();
        const color = colorBySlug.get(colorSlug);
        if (!color) {
          stats.skippedNoColorInDb++;
          console.warn(`⚠️ В папках есть цвет "${prodSlugRaw}/${colorSlugRaw}", но в БД такого colorSlug нет. Пропуск.`);
          continue;
        }

        stats.scannedColors++;

        // чистим старые картинки этого цвета, чтобы не плодить дубли
        await tx.image.deleteMany({ where: { colorId: color.id } });

        const dirAbs = path.join(ROOT, prodSlugRaw, colorSlugRaw);
        const files = listImageFiles(dirAbs);

        for (let i = 0; i < files.length; i++) {
          const file = files[i]!;
          const url = `/images/products/${prodSlugRaw}/${colorSlugRaw}/${file}`;

          await tx.image.create({
            data: {
              colorId: color.id,
              url,
              alt: "",
              sortOrder: i,
            },
          });

          stats.createdImages++;
        }
      }
    }
  });

  console.log("✅ Синхронизация картинок завершена:", stats);
}

main()
  .catch((e) => {
    console.error("❌ sync-images ошибка:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
