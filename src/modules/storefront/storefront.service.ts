import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StorefrontHomeResponse } from './types/storefront-home.types';

@Injectable()
export class StorefrontService {
  constructor(private readonly prisma: PrismaService) {}

  async getHome(): Promise<StorefrontHomeResponse> {
    const store = await this.prisma.store.findUnique({
      where: { slug: 'digital-commerce' },
      include: {
        settings: true,
        categories: {
          where: { isVisibleHome: true },
          orderBy: { sortOrder: 'asc' },
        },
        products: {
          where: {
            isFeatured: true,
            status: 'ACTIVE',
          },
          include: {
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException(
        'Default store not found. Run the database seed first.',
      );
    }

    return {
      store: {
        name: store.name,
        logoUrl: store.logoUrl || '/logo.svg',
      },
      hero: {
        mediaType: store.settings?.heroMediaType || 'IMAGE',
        mediaUrl: store.settings?.heroMediaUrl || '/demo/hero.jpg',
        posterUrl: store.settings?.heroPosterUrl ?? undefined,
        title: store.settings?.heroTitle || 'Welcome',
        subtitle: store.settings?.heroSubtitle || '',
      },
      categories: store.categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
      featuredProducts: store.products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        priceCents: product.priceCents,
        imageUrl: product.images[0]?.url || '/placeholder.jpg',
      })),
    };
  }
}
