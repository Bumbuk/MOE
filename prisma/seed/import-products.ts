import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { prisma } from "../../lib/db";

type ProductRow = {
  slug: string;
  title: string;
  category?: string;
  description?: string;
  status?: "ACTIVE" | "HIDDEN";

  popular?: string; // 1..4 или пусто
  preview?: string; // 1..3 или пусто
  composition?: string; // текст или пусто
  certification?: string; // текст/ссылка или пусто
};

type ColorRow = {
  productSlug: string;
  colorSlug: string;
  colorName: string;
  sortOrder?: string;
};

type VariantRow = {
  productSlug: string;
  colorSlug: string;
  size: string;
  sku: string;
  price: string; // рубли, целое
  stock?: string; // целое, если пусто -> 0
  status?: "ACTIVE" | "HIDDEN";
};

function readCsv<T extends Record<string, unknown>>(filePath: string): T[] {
  const content = fs.readFileSync(filePath, "utf-8");

  const firstLine = content.split(/\r?\n/)[0] ?? "";
  const delimiter = firstLine.includes(";") ? ";" : ",";

  const records = parse(content, {
    columns: (headers: string[]) => headers.map((h) => h.replace(/^\uFEFF/, "").trim()),
    skip_empty_lines: true,
    trim: true,
    delimiter,
  }) as T[];

  return records.filter((row) => Object.values(row).some((v) => String(v ?? "").trim() !== ""));
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

function norm(v: unknown) {
  return String(v ?? "").trim();
}

function toIntRequired(v: string, field: string): number {
  const n = Number(norm(v));
  assert(Number.isInteger(n), `Поле ${field} должно быть целым: ${v}`);
  return n;
}

function toIntOrZero(v?: string): number {
  const s = norm(v);
  if (!s) return 0;
  const n = Number(s);
  assert(Number.isInteger(n), `Ожидалось целое число: ${v}`);
  return n;
}

function toIntOrNull(v?: string): number | null {
  const s = norm(v);
  if (!s) return null;
  const n = Number(s);
  assert(Number.isInteger(n), `Ожидалось целое число: ${v}`);
  return n;
}

function intInRangeOrNull(v: string | undefined, field: string, min: number, max: number): number | null {
  const n = toIntOrNull(v);
  if (n === null) return null;
  assert(n >= min && n <= max, `Поле ${field} должно быть в диапазоне ${min}..${max}: ${n}`);
  return n;
}

function sizeSortFromSize(size: string) {
  const n = Number(norm(size));
  return Number.isFinite(n) ? Math.trunc(n) : 999999;
}

function key(productSlug: string, colorSlug: string) {
  return `${norm(productSlug)}::${norm(colorSlug)}`;
}

function checkUniqueSlots(products: ProductRow[]) {
  const pop = new Map<number, string>();
  const prev = new Map<number, string>();

  for (const p of products) {
    const slug = norm(p.slug);
    if (!slug) continue;

    const popular = intInRangeOrNull(p.popular, "popular", 1, 4);
    if (popular !== null) {
      const existed = pop.get(popular);
      assert(!existed, `Дублируется popular=${popular}: ${existed} и ${slug}`);
      pop.set(popular, slug);
    }

    const preview = intInRangeOrNull(p.preview, "preview", 1, 3);
    if (preview !== null) {
      const existed = prev.get(preview);
      assert(!existed, `Дублируется preview=${preview}: ${existed} и ${slug}`);
      prev.set(preview, slug);
    }
  }
}

async function main() {
  const dataDir = path.join(process.cwd(), "data");
  const productsPath = path.join(dataDir, "products.csv");
  const colorsPath = path.join(dataDir, "colors.csv");
  const variantsPath = path.join(dataDir, "variants.csv");

  assert(fs.existsSync(productsPath), `Нет файла: ${productsPath}`);
  assert(fs.existsSync(colorsPath), `Нет файла: ${colorsPath}`);
  assert(fs.existsSync(variantsPath), `Нет файла: ${variantsPath}`);

  const products = readCsv<ProductRow>(productsPath);
  const colors = readCsv<ColorRow>(colorsPath);
  const variants = readCsv<VariantRow>(variantsPath);

  // защита от дублей popular/preview
  checkUniqueSlots(products);

  const colorsByProduct = new Map<string, ColorRow[]>();
  for (const c of colors) {
    const ps = norm(c.productSlug);
    if (!ps) continue;
    const arr = colorsByProduct.get(ps) ?? [];
    arr.push(c);
    colorsByProduct.set(ps, arr);
  }

  const variantsByKey = new Map<string, VariantRow[]>();
  for (const v of variants) {
    const k = key(v.productSlug, v.colorSlug);
    const arr = variantsByKey.get(k) ?? [];
    arr.push(v);
    variantsByKey.set(k, arr);
  }

  await prisma.$transaction(async (tx) => {
    for (const p of products) {
      const slug = norm(p.slug);
      assert(slug && /^[a-z0-9-]+$/.test(slug), `Некорректный slug: ${p.slug}`);

      const title = norm(p.title);
      assert(title && title.length <= 200, `Некорректный title у ${slug}`);

      const category = norm(p.category) || null;
      const description = norm(p.description) || "";
      const status = ((p.status ?? "ACTIVE") === "HIDDEN" ? "HIDDEN" : "ACTIVE") as "ACTIVE" | "HIDDEN";

      const popular = intInRangeOrNull(p.popular, "popular", 1, 4);
      const preview = intInRangeOrNull(p.preview, "preview", 1, 3);
      const composition = norm(p.composition) || null;
      const certification = norm(p.certification) || null;

      const product = await tx.product.upsert({
        where: { slug },
        create: {
          slug,
          title,
          category,
          description,
          status,
          popular,
          preview,
          composition,
          certification,
        },
        update: {
          title,
          category,
          description,
          status,
          popular,
          preview,
          composition,
          certification,
        },
        select: { id: true },
      });

      // чистим цвета (варианты каскадом)
      await tx.productColor.deleteMany({ where: { productId: product.id } });

      const colorRowsRaw = (colorsByProduct.get(slug) ?? []).slice();
      colorRowsRaw.sort((a, b) => toIntOrZero(a.sortOrder) - toIntOrZero(b.sortOrder));

      // защита от дублей colorSlug внутри одного продукта
      const seenColorSlug = new Set<string>();
      const colorRows: ColorRow[] = [];
      for (const c of colorRowsRaw) {
        const cs = norm(c.colorSlug) || "default";
        if (seenColorSlug.has(cs)) continue;
        seenColorSlug.add(cs);
        colorRows.push(c);
      }

      for (let idx = 0; idx < colorRows.length; idx++) {
        const c = colorRows[idx]!;
        const colorSlug = norm(c.colorSlug) || "default";
        const colorName = norm(c.colorName) || "Без цвета";

        assert(colorSlug && /^[a-z0-9-]+$/.test(colorSlug), `Некорректный colorSlug у ${slug}: ${c.colorSlug}`);
        assert(colorName.length <= 80, `Слишком длинное colorName у ${slug}/${colorSlug}`);

        const color = await tx.productColor.create({
          data: {
            productId: product.id,
            name: colorName,
            slug: colorSlug,
            sortOrder: toIntOrZero(c.sortOrder) || idx,
          },
          select: { id: true },
        });

        const vRows = (variantsByKey.get(key(slug, colorSlug)) ?? []).slice();

        // защита от дублей размеров внутри цвета (уникальность colorId+size)
        const seenSize = new Set<string>();
        for (const v of vRows) {
          const size = norm(v.size);
          const sku = norm(v.sku);
          const price = toIntRequired(v.price, "price");
          const stock = toIntOrZero(v.stock);
          const vStatus = ((v.status ?? "ACTIVE") === "HIDDEN" ? "HIDDEN" : "ACTIVE") as "ACTIVE" | "HIDDEN";

          assert(size && size.length <= 20, `Некорректный size у ${slug}/${colorSlug}`);
          assert(sku && sku.length <= 64, `Некорректный sku у ${slug}/${colorSlug}`);
          assert(!/[\r\n\t]/.test(sku), `Запрещённые символы в sku: ${sku}`);

          if (seenSize.has(size)) continue;
          seenSize.add(size);

          await tx.variant.create({
            data: {
              colorId: color.id,
              size,
              sizeSort: sizeSortFromSize(size),
              sku,
              price,
              stock,
              status: vStatus,
            },
          });
        }
      }
    }
  });

  console.log(`✅ Импорт завершён. Products: ${products.length}, Colors: ${colors.length}, Variants: ${variants.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка импорта:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
