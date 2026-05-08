import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UploadImageDto } from './dto/upload-image.dto';

@Injectable()
export class AdminProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private async getStoreId(): Promise<string> {
    const storeSlug = this.config.get<string>('DEFAULT_STORE_SLUG');
    const store = await this.prisma.store.findUnique({
      where: { slug: storeSlug },
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store.id;
  }

  async findAll(query: QueryProductsDto) {
    const storeId = await this.getStoreId();
    const where: Prisma.ProductWhereInput = { storeId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            url: true,
            alt: true,
            sortOrder: true,
          },
        },
        variants: {
          select: {
            id: true,
            name: true,
            stock: true,
            priceCents: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return products;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            url: true,
            alt: true,
            sortOrder: true,
          },
        },
        variants: {
          select: {
            id: true,
            name: true,
            sku: true,
            size: true,
            color: true,
            stock: true,
            priceCents: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const storeId = await this.getStoreId();

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${dto.categoryId} not found`,
      );
    }

    if (!category.isActive) {
      throw new ConflictException('Cannot create product in inactive category');
    }

    const existingProduct = await this.prisma.product.findFirst({
      where: {
        storeId,
        slug: dto.slug,
      },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with slug "${dto.slug}" already exists`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        storeId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        priceCents: dto.priceCents,
        categoryId: dto.categoryId,
        status: dto.status || ProductStatus.DRAFT,
        isFeatured: dto.isFeatured ?? false,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: true,
        variants: true,
      },
    });

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.slug && dto.slug !== product.slug) {
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          storeId: product.storeId,
          slug: dto.slug,
          id: { not: id },
        },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with slug "${dto.slug}" already exists`,
        );
      }
    }

    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${dto.categoryId} not found`,
        );
      }

      if (!category.isActive) {
        throw new ConflictException(
          'Cannot assign product to inactive category',
        );
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: true,
        variants: true,
      },
    });

    return updatedProduct;
  }

  async archive(id: string) {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ARCHIVED },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: true,
        variants: true,
      },
    });

    return product;
  }

  async publish(id: string) {
    const product = await this.findOne(id);

    if (product.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: product.categoryId },
      });

      if (!category?.isActive) {
        throw new ConflictException(
          'Cannot publish product in inactive category',
        );
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ACTIVE },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: true,
        variants: true,
      },
    });

    return updatedProduct;
  }

  async unpublish(id: string) {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.DRAFT },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: true,
        variants: true,
      },
    });

    return product;
  }

  async addImage(id: string, dto: UploadImageDto) {
    await this.findOne(id);

    const imageCount = await this.prisma.productImage.count({
      where: { productId: id },
    });

    await this.prisma.productImage.create({
      data: {
        productId: id,
        url: dto.imageUrl,
        sortOrder: imageCount,
      },
    });

    return this.findOne(id);
  }
}
