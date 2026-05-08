import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';

@Injectable()
export class AdminCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private async getStoreId(): Promise<string> {
    const slug = this.config.getOrThrow<string>('DEFAULT_STORE_SLUG');
    const store = await this.prisma.store.findUnique({
      where: { slug },
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store.id;
  }

  async findAll() {
    const storeId = await this.getStoreId();

    const categories = await this.prisma.category.findMany({
      where: { storeId },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { status: ProductStatus.ACTIVE },
            },
          },
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      storeId: category.storeId,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      imageUrl: category.imageUrl ?? undefined,
      isActive: category.isActive,
      isVisibleHome: category.isVisibleHome,
      sortOrder: category.sortOrder,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }

  async findOne(id: string) {
    const storeId = await this.getStoreId();

    const category = await this.prisma.category.findUnique({
      where: { id, storeId },
      include: {
        _count: {
          select: {
            products: {
              where: { status: ProductStatus.ACTIVE },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      id: category.id,
      storeId: category.storeId,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      imageUrl: category.imageUrl ?? undefined,
      isActive: category.isActive,
      isVisibleHome: category.isVisibleHome,
      sortOrder: category.sortOrder,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async create(dto: CreateCategoryDto) {
    const storeId = await this.getStoreId();

    const existing = await this.prisma.category.findUnique({
      where: {
        storeId_slug: {
          storeId,
          slug: dto.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Category with slug "${dto.slug}" already exists`,
      );
    }

    return this.prisma.category.create({
      data: {
        storeId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive ?? true,
        isVisibleHome: dto.isVisibleHome ?? false,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: {
        _count: {
          select: {
            products: {
              where: { status: ProductStatus.ACTIVE },
            },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const storeId = await this.getStoreId();

    const category = await this.prisma.category.findUnique({
      where: { id, storeId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({
        where: {
          storeId_slug: {
            storeId,
            slug: dto.slug,
          },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Category with slug "${dto.slug}" already exists`,
        );
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
      include: {
        _count: {
          select: {
            products: {
              where: { status: ProductStatus.ACTIVE },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const storeId = await this.getStoreId();

    const category = await this.prisma.category.findUnique({
      where: { id, storeId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const productCount = await this.prisma.product.count({
      where: {
        categoryId: id,
        status: { not: ProductStatus.ARCHIVED },
      },
    });

    if (productCount > 0) {
      throw new ConflictException(
        `Cannot delete category with ${productCount} active product(s). Archive products first or deactivate category instead.`,
      );
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async activate(id: string) {
    const storeId = await this.getStoreId();

    const category = await this.prisma.category.findUnique({
      where: { id, storeId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string) {
    const storeId = await this.getStoreId();

    const category = await this.prisma.category.findUnique({
      where: { id, storeId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async reorder(dto: ReorderCategoriesDto) {
    const storeId = await this.getStoreId();

    return this.prisma.$transaction(async (tx) => {
      const categories = await tx.category.findMany({
        where: {
          id: { in: dto.items.map((i) => i.id) },
          storeId,
        },
      });

      if (categories.length !== dto.items.length) {
        throw new NotFoundException('One or more categories not found');
      }

      await Promise.all(
        dto.items.map((item) =>
          tx.category.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          }),
        ),
      );

      return {
        updated: dto.items.length,
        message: 'Category order updated successfully',
      };
    });
  }
}
