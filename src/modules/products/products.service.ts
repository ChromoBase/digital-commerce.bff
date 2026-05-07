import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ProductListResponse,
  ProductDetailResponse,
} from './types/product-response.types';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    category?: string,
    featured?: boolean,
  ): Promise<ProductListResponse[]> {
    const store = await this.prisma.store.findUnique({
      where: { slug: 'digital-commerce' },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const products = await this.prisma.product.findMany({
      where: {
        storeId: store.id,
        status: 'ACTIVE',
        ...(category && {
          category: {
            slug: category,
          },
        }),
        ...(featured !== undefined && { isFeatured: featured }),
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.priceCents,
      imageUrl: product.images[0]?.url,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : undefined,
    }));
  }

  async findOne(slug: string): Promise<ProductDetailResponse> {
    const store = await this.prisma.store.findUnique({
      where: { slug: 'digital-commerce' },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const product = await this.prisma.product.findUnique({
      where: {
        storeId_slug: {
          storeId: store.id,
          slug,
        },
        status: 'ACTIVE',
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product '${slug}' not found`);
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? undefined,
      priceCents: product.priceCents,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : undefined,
      images: product.images.map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt ?? undefined,
      })),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku ?? undefined,
        size: variant.size ?? undefined,
        color: variant.color ?? undefined,
        stock: variant.stock,
        priceCents: variant.priceCents ?? undefined,
      })),
    };
  }
}
