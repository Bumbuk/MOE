const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
require("dotenv/config");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const outerwearCategory = await prisma.category.create({
    data: {
      slug: "outerwear",
      name: "Верхняя одежда",
      description: "Базовые и акцентные модели на каждый день.",
    },
  });

  const setsCategory = await prisma.category.create({
    data: {
      slug: "sets",
      name: "Комплекты",
      description: "Готовые образы на каждый день.",
    },
  });

  const shirtsCategory = await prisma.category.create({
    data: {
      slug: "shirts",
      name: "Рубашки",
      description: "Базовые вещи с чистым силуэтом.",
    },
  });

  await prisma.product.create({
    data: {
      slug: "bomber",
      title: "Бомбер Banana Mood",
      description:
        "Лёгкий бомбер с объёмной посадкой и мягкой подкладкой для городского гардероба.",
      shortDescription: "Лёгкий бомбер с акцентным цветом и мягкой фактурой.",
      status: "ACTIVE",
      composition: "65% хлопок, 35% полиэстер",
      certification: "Сертифицировано по стандарту OEKO-TEX",
      popularRank: 1,
      previewRank: 1,
      categoryId: outerwearCategory.id,
      colors: {
        create: [
          {
            slug: "banana",
            name: "Banana",
            sortOrder: 1,
            variants: {
              create: [
                {
                  size: "S",
                  sku: "BOMBER-BANANA-S",
                  price: "12990",
                  oldPrice: "14990",
                  stock: 4,
                  status: "ACTIVE",
                },
                {
                  size: "M",
                  sku: "BOMBER-BANANA-M",
                  price: "12990",
                  oldPrice: "14990",
                  stock: 2,
                  status: "ACTIVE",
                },
              ],
            },
          },
        ],
      },
      images: {
        create: [
          {
            path: "/images/products/bomber/banana/1.webp",
            alt: "Бомбер Banana Mood",
            sortOrder: 1,
            isMain: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "knit-set",
      title: "Трикотажный комплект Cloud",
      description:
        "Мягкий комплект из свободного свитшота и прямых брюк для спокойных образов.",
      shortDescription: "Комплект из плотного трикотажа с расслабленной посадкой.",
      status: "ACTIVE",
      composition: "80% хлопок, 20% эластан",
      certification: "Подходит для ежедневной носки",
      popularRank: 2,
      previewRank: 2,
      categoryId: setsCategory.id,
      colors: {
        create: [
          {
            slug: "oat",
            name: "Oat",
            sortOrder: 1,
            variants: {
              create: [
                {
                  size: "S",
                  sku: "KNIT-SET-OAT-S",
                  price: "9990",
                  stock: 6,
                  status: "ACTIVE",
                },
                {
                  size: "M",
                  sku: "KNIT-SET-OAT-M",
                  price: "9990",
                  stock: 1,
                  status: "ACTIVE",
                },
              ],
            },
          },
        ],
      },
      images: {
        create: [
          {
            path: "/images/products/knit-set/oat/1.webp",
            alt: "Трикотажный комплект Cloud",
            sortOrder: 1,
            isMain: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "cotton-shirt",
      title: "Рубашка Cotton Form",
      description:
        "Плотная хлопковая рубашка прямого кроя, которая работает как самостоятельный слой и как overshirt.",
      shortDescription: "Прямая хлопковая рубашка для многослойных образов.",
      status: "ACTIVE",
      composition: "100% хлопок",
      certification: "Мягкая ткань с предсказуемой посадкой",
      popularRank: 3,
      previewRank: 3,
      categoryId: shirtsCategory.id,
      colors: {
        create: [
          {
            slug: "milk",
            name: "Milk",
            sortOrder: 1,
            variants: {
              create: [
                {
                  size: "S",
                  sku: "SHIRT-MILK-S",
                  price: "7490",
                  stock: 3,
                  status: "ACTIVE",
                },
                {
                  size: "M",
                  sku: "SHIRT-MILK-M",
                  price: "7490",
                  stock: 0,
                  status: "OUT_OF_STOCK",
                },
              ],
            },
          },
        ],
      },
      images: {
        create: [
          {
            path: "/images/products/cotton-shirt/milk/1.webp",
            alt: "Рубашка Cotton Form",
            sortOrder: 1,
            isMain: true,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
