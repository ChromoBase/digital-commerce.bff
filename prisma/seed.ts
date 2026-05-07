import { PrismaClient, MediaType, ProductStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Use DIRECT_URL for seeding to avoid PgBouncer prepared statement issues
const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Upsert default store
  const store = await prisma.store.upsert({
    where: { slug: 'digital-commerce' },
    update: {},
    create: {
      slug: 'digital-commerce',
      name: 'Digital Commerce',
      logoUrl: '/logo.svg',
      currency: 'USD',
    },
  });

  // Upsert storefront settings
  await prisma.storefrontSettings.upsert({
    where: { storeId: store.id },
    update: {
      heroMediaType: MediaType.IMAGE,
      heroMediaUrl: '/demo/hero-bg.jpg',
      heroTitle: 'Discover Your Style',
      heroSubtitle: 'Premium fashion for the modern wardrobe',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
    },
    create: {
      storeId: store.id,
      heroMediaType: MediaType.IMAGE,
      heroMediaUrl: '/demo/hero-bg.jpg',
      heroTitle: 'Discover Your Style',
      heroSubtitle: 'Premium fashion for the modern wardrobe',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
    },
  });

  // Upsert categories
  const menCategory = await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'men',
      },
    },
    update: {
      name: 'Men',
      isVisibleHome: true,
      sortOrder: 1,
    },
    create: {
      storeId: store.id,
      slug: 'men',
      name: 'Men',
      description: "Men's clothing and accessories",
      imageUrl: '/demo/categories/men.jpg',
      isVisibleHome: true,
      sortOrder: 1,
    },
  });

  const womenCategory = await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'women',
      },
    },
    update: {
      name: 'Women',
      isVisibleHome: true,
      sortOrder: 2,
    },
    create: {
      storeId: store.id,
      slug: 'women',
      name: 'Women',
      description: "Women's clothing and accessories",
      imageUrl: '/demo/categories/women.jpg',
      isVisibleHome: true,
      sortOrder: 2,
    },
  });

  // Upsert products
  const blackHoodie = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'oversized-black-hoodie',
      },
    },
    update: {
      name: 'Oversized Black Hoodie',
      description:
        'Premium oversized hoodie in classic black. Made from soft cotton blend for ultimate comfort.',
      priceCents: 7999,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: menCategory.id,
    },
    create: {
      storeId: store.id,
      categoryId: menCategory.id,
      slug: 'oversized-black-hoodie',
      name: 'Oversized Black Hoodie',
      description:
        'Premium oversized hoodie in classic black. Made from soft cotton blend for ultimate comfort.',
      priceCents: 7999,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
  });

  const whiteTee = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'cropped-white-tee',
      },
    },
    update: {
      name: 'Cropped White Tee',
      description:
        'Modern cropped white tee with a relaxed fit. Perfect for any casual occasion.',
      priceCents: 3999,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: womenCategory.id,
    },
    create: {
      storeId: store.id,
      categoryId: womenCategory.id,
      slug: 'cropped-white-tee',
      name: 'Cropped White Tee',
      description:
        'Modern cropped white tee with a relaxed fit. Perfect for any casual occasion.',
      priceCents: 3999,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
  });

  // Delete and recreate product images to ensure clean state
  await prisma.productImage.deleteMany({
    where: {
      productId: {
        in: [blackHoodie.id, whiteTee.id],
      },
    },
  });

  await prisma.productImage.create({
    data: {
      productId: blackHoodie.id,
      url: '/demo/products/black-hoodie.jpg',
      alt: 'Oversized Black Hoodie',
      sortOrder: 1,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: whiteTee.id,
      url: '/demo/products/white-tee.jpg',
      alt: 'Cropped White Tee',
      sortOrder: 1,
    },
  });

  // Delete and recreate product variants to ensure clean state
  await prisma.productVariant.deleteMany({
    where: {
      productId: {
        in: [blackHoodie.id, whiteTee.id],
      },
    },
  });

  // Add variants for Black Hoodie
  const hoodieVariants = [
    {
      name: 'Small - Black',
      size: 'S',
      color: 'Black',
      stock: 15,
      sku: 'BH-S-BLK',
    },
    {
      name: 'Medium - Black',
      size: 'M',
      color: 'Black',
      stock: 25,
      sku: 'BH-M-BLK',
    },
    {
      name: 'Large - Black',
      size: 'L',
      color: 'Black',
      stock: 20,
      sku: 'BH-L-BLK',
    },
    {
      name: 'X-Large - Black',
      size: 'XL',
      color: 'Black',
      stock: 10,
      sku: 'BH-XL-BLK',
    },
  ];

  for (const variant of hoodieVariants) {
    await prisma.productVariant.create({
      data: {
        productId: blackHoodie.id,
        ...variant,
      },
    });
  }

  // Add variants for White Tee
  const teeVariants = [
    {
      name: 'Small - White',
      size: 'S',
      color: 'White',
      stock: 20,
      sku: 'WT-S-WHT',
    },
    {
      name: 'Medium - White',
      size: 'M',
      color: 'White',
      stock: 30,
      sku: 'WT-M-WHT',
    },
    {
      name: 'Large - White',
      size: 'L',
      color: 'White',
      stock: 25,
      sku: 'WT-L-WHT',
    },
  ];

  for (const variant of teeVariants) {
    await prisma.productVariant.create({
      data: {
        productId: whiteTee.id,
        ...variant,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
