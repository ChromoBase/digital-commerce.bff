import { PrismaClient, MediaType, ProductStatus, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as argon2 from 'argon2';

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const store = await prisma.store.upsert({
    where: { slug: 'digicams' },
    update: {},
    create: {
      slug: 'digicams',
      name: 'Digicams',
      logoUrl: '/brand/digicams-logo.svg',
      currency: 'USD',
    },
  });

  await prisma.storefrontSettings.upsert({
    where: { storeId: store.id },
    update: {
      heroMediaType: MediaType.IMAGE,
      heroMediaUrl: '/demo/digicams/hero.jpg',
      heroTitle: 'Capture Every Moment',
      heroSubtitle:
        'Curated digital cameras, film cameras, lenses and accessories.',
      primaryColor: '#111111',
      secondaryColor: '#f5f5f5',
    },
    create: {
      storeId: store.id,
      heroMediaType: MediaType.IMAGE,
      heroMediaUrl: '/demo/digicams/hero.jpg',
      heroTitle: 'Capture Every Moment',
      heroSubtitle:
        'Curated digital cameras, film cameras, lenses and accessories.',
      primaryColor: '#111111',
      secondaryColor: '#f5f5f5',
    },
  });

  const adminPasswordHash = await argon2.hash('AdminPass123!');
  const customerPasswordHash = await argon2.hash('CustomerPass123!');

  await prisma.user.upsert({
    where: { email: 'admin@digicams.dev' },
    update: {
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
    create: {
      email: 'admin@digicams.dev',
      name: 'Digicams Admin',
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'customer@digicams.dev' },
    update: {
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
    },
    create: {
      email: 'customer@digicams.dev',
      name: 'Demo Customer',
      role: Role.CUSTOMER,
      passwordHash: customerPasswordHash,
    },
  });

  const digitalCamerasCategory = await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'digital-cameras',
      },
    },
    update: {
      name: 'Digital Cameras',
      isVisibleHome: true,
      sortOrder: 1,
    },
    create: {
      storeId: store.id,
      slug: 'digital-cameras',
      name: 'Digital Cameras',
      description: 'Modern digital cameras for photography and videography',
      imageUrl: '/demo/digicams/categories/digital-cameras.jpg',
      isVisibleHome: true,
      sortOrder: 1,
    },
  });

  const filmCamerasCategory = await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'film-cameras',
      },
    },
    update: {
      name: 'Film Cameras',
      isVisibleHome: true,
      sortOrder: 2,
    },
    create: {
      storeId: store.id,
      slug: 'film-cameras',
      name: 'Film Cameras',
      description: 'Classic film cameras and instant cameras',
      imageUrl: '/demo/digicams/categories/film-cameras.jpg',
      isVisibleHome: true,
      sortOrder: 2,
    },
  });

  void (await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'lenses',
      },
    },
    update: {
      name: 'Lenses',
      isVisibleHome: true,
      sortOrder: 3,
    },
    create: {
      storeId: store.id,
      slug: 'lenses',
      name: 'Lenses',
      description: 'Quality lenses for all camera systems',
      imageUrl: '/demo/digicams/categories/lenses.jpg',
      isVisibleHome: true,
      sortOrder: 3,
    },
  }));

  void (await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'accessories',
      },
    },
    update: {
      name: 'Accessories',
      isVisibleHome: true,
      sortOrder: 4,
    },
    create: {
      storeId: store.id,
      slug: 'accessories',
      name: 'Accessories',
      description: 'Camera bags, tripods, memory cards, and more',
      imageUrl: '/demo/digicams/categories/accessories.jpg',
      isVisibleHome: true,
      sortOrder: 4,
    },
  }));

  const canonG7X = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'canon-powershot-g7-x-mark-iii',
      },
    },
    update: {
      name: 'Canon PowerShot G7 X Mark III',
      description:
        'Compact digital camera with 20.1MP sensor, 4K video recording, and live streaming capability. Perfect for vlogging and content creation.',
      priceCents: 74900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: digitalCamerasCategory.id,
    },
    create: {
      storeId: store.id,
      categoryId: digitalCamerasCategory.id,
      slug: 'canon-powershot-g7-x-mark-iii',
      name: 'Canon PowerShot G7 X Mark III',
      description:
        'Compact digital camera with 20.1MP sensor, 4K video recording, and live streaming capability. Perfect for vlogging and content creation.',
      priceCents: 74900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
  });

  const sonyZV1 = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'sony-zv-1',
      },
    },
    update: {
      name: 'Sony ZV-1',
      description:
        'Vlogging camera designed for content creators with fast autofocus, eye tracking, and excellent video quality in a compact body.',
      priceCents: 69900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: digitalCamerasCategory.id,
    },
    create: {
      storeId: store.id,
      categoryId: digitalCamerasCategory.id,
      slug: 'sony-zv-1',
      name: 'Sony ZV-1',
      description:
        'Vlogging camera designed for content creators with fast autofocus, eye tracking, and excellent video quality in a compact body.',
      priceCents: 69900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
  });

  const fujifilmX100V = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'fujifilm-x100v',
      },
    },
    update: {
      name: 'Fujifilm X100V',
      description:
        'Premium compact camera with 26.1MP X-Trans sensor, hybrid viewfinder, and classic design. The ultimate street photography camera.',
      priceCents: 139900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: digitalCamerasCategory.id,
    },
    create: {
      storeId: store.id,
      categoryId: digitalCamerasCategory.id,
      slug: 'fujifilm-x100v',
      name: 'Fujifilm X100V',
      description:
        'Premium compact camera with 26.1MP X-Trans sensor, hybrid viewfinder, and classic design. The ultimate street photography camera.',
      priceCents: 139900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
  });

  const kodakEktarH35 = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'kodak-ektar-h35',
      },
    },
    update: {
      name: 'Kodak Ektar H35',
      description:
        'Affordable half-frame film camera for 35mm film. Get double the shots per roll with this fun and portable camera.',
      priceCents: 4900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      categoryId: filmCamerasCategory.id,
    },
    create: {
      storeId: store.id,
      categoryId: filmCamerasCategory.id,
      slug: 'kodak-ektar-h35',
      name: 'Kodak Ektar H35',
      description:
        'Affordable half-frame film camera for 35mm film. Get double the shots per roll with this fun and portable camera.',
      priceCents: 4900,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
    },
  });

  await prisma.productImage.deleteMany({
    where: {
      productId: {
        in: [canonG7X.id, sonyZV1.id, fujifilmX100V.id, kodakEktarH35.id],
      },
    },
  });

  await prisma.productImage.create({
    data: {
      productId: canonG7X.id,
      url: '/demo/digicams/products/canon-powershot-g7-x-mark-iii.jpg',
      alt: 'Canon PowerShot G7 X Mark III',
      sortOrder: 1,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: sonyZV1.id,
      url: '/demo/digicams/products/sony-zv-1.jpg',
      alt: 'Sony ZV-1',
      sortOrder: 1,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: fujifilmX100V.id,
      url: '/demo/digicams/products/fujifilm-x100v.jpg',
      alt: 'Fujifilm X100V',
      sortOrder: 1,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: kodakEktarH35.id,
      url: '/demo/digicams/products/kodak-ektar-h35.jpg',
      alt: 'Kodak Ektar H35',
      sortOrder: 1,
    },
  });

  await prisma.productVariant.deleteMany({
    where: {
      productId: {
        in: [canonG7X.id, sonyZV1.id, fujifilmX100V.id, kodakEktarH35.id],
      },
    },
  });

  const canonG7XVariants = [
    {
      name: 'Body Only - Black',
      color: 'Black',
      stock: 12,
      sku: 'CAN-G7X3-BLK',
    },
    {
      name: 'Body Only - Silver',
      color: 'Silver',
      stock: 8,
      sku: 'CAN-G7X3-SLV',
    },
  ];

  for (const variant of canonG7XVariants) {
    await prisma.productVariant.create({
      data: {
        productId: canonG7X.id,
        ...variant,
      },
    });
  }

  const sonyZV1Variants = [
    {
      name: 'Standard - Black',
      color: 'Black',
      stock: 15,
      sku: 'SNY-ZV1-BLK',
    },
    {
      name: 'Vlogger Kit - Black',
      color: 'Black',
      stock: 6,
      sku: 'SNY-ZV1-KIT',
      priceCents: 79900,
    },
  ];

  for (const variant of sonyZV1Variants) {
    await prisma.productVariant.create({
      data: {
        productId: sonyZV1.id,
        ...variant,
      },
    });
  }

  const fujifilmX100VVariants = [
    {
      name: 'Black',
      color: 'Black',
      stock: 5,
      sku: 'FUJI-X100V-BLK',
    },
    {
      name: 'Silver',
      color: 'Silver',
      stock: 7,
      sku: 'FUJI-X100V-SLV',
    },
  ];

  for (const variant of fujifilmX100VVariants) {
    await prisma.productVariant.create({
      data: {
        productId: fujifilmX100V.id,
        ...variant,
      },
    });
  }

  const kodakEktarH35Variants = [
    {
      name: 'Black',
      color: 'Black',
      stock: 25,
      sku: 'KDK-H35-BLK',
    },
    {
      name: 'Sand',
      color: 'Sand',
      stock: 20,
      sku: 'KDK-H35-SND',
    },
    {
      name: 'Sage',
      color: 'Sage',
      stock: 18,
      sku: 'KDK-H35-SGE',
    },
  ];

  for (const variant of kodakEktarH35Variants) {
    await prisma.productVariant.create({
      data: {
        productId: kodakEktarH35.id,
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
