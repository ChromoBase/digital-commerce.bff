import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import {
  CategoryResponse,
  CategoryProductsResponse,
} from './types/category-response.types';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<CategoryResponse[]> {
    const store = await this.prisma.store.findUnique({
      where: {
        slug: this.configService.getOrThrow<string>('DEFAULT_STORE_SLUG'),
      },
      include: {
        categories: {
          where: {
            isActive: true,
            isVisibleHome: true,
          },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: {
                products: {
                  where: { status: 'ACTIVE' },
                },
              },
            },
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      imageUrl: category.imageUrl ?? undefined,
      productCount: category._count.products,
    }));
  }

  async findCategoryProducts(slug: string): Promise<CategoryProductsResponse> {
    const store = await this.prisma.store.findUnique({
      where: {
        slug: this.configService.getOrThrow<string>('DEFAULT_STORE_SLUG'),
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const category = await this.prisma.category.findUnique({
      where: {
        storeId_slug: {
          storeId: store.id,
          slug,
        },
      },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          include: {
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category '${slug}' not found`);
    }

    if (!category.isActive) {
      throw new NotFoundException(`Category '${slug}' not found`);
    }

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
      },
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        priceCents: product.priceCents,
        imageUrl: product.images[0]?.url,
      })),
    };
  }
}
