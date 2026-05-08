import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class AdminVariantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });

    return variants;
  }

  async findOne(id: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return variant;
  }

  async create(productId: string, dto: CreateVariantDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        name: dto.name,
        sku: dto.sku,
        size: dto.size,
        color: dto.color,
        stock: dto.stock,
        priceCents: dto.priceCents,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return variant;
  }

  async update(id: string, dto: UpdateVariantDto) {
    await this.findOne(id);

    const variant = await this.prisma.productVariant.update({
      where: { id },
      data: dto,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return variant;
  }

  async remove(id: string) {
    await this.findOne(id);

    const variant = await this.prisma.productVariant.delete({
      where: { id },
    });

    return variant;
  }

  async updateStock(id: string, stock: number) {
    if (stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    await this.findOne(id);

    const variant = await this.prisma.productVariant.update({
      where: { id },
      data: { stock },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return variant;
  }
}
