import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ReorderFaqsDto } from './dto/reorder-faqs.dto';

@Injectable()
export class AdminFaqsService {
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

  async findAll() {
    const storeId = await this.getStoreId();

    const faqs = await this.prisma.fAQ.findMany({
      where: { storeId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return faqs;
  }

  async findOne(id: string) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return faq;
  }

  async create(dto: CreateFaqDto) {
    const storeId = await this.getStoreId();

    const faq = await this.prisma.fAQ.create({
      data: {
        storeId,
        question: dto.question,
        answer: dto.answer,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });

    return faq;
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.findOne(id);

    const faq = await this.prisma.fAQ.update({
      where: { id },
      data: dto,
    });

    return faq;
  }

  async remove(id: string) {
    await this.findOne(id);

    const faq = await this.prisma.fAQ.delete({
      where: { id },
    });

    return faq;
  }

  async activate(id: string) {
    await this.findOne(id);

    const faq = await this.prisma.fAQ.update({
      where: { id },
      data: { isActive: true },
    });

    return faq;
  }

  async deactivate(id: string) {
    await this.findOne(id);

    const faq = await this.prisma.fAQ.update({
      where: { id },
      data: { isActive: false },
    });

    return faq;
  }

  async reorder(dto: ReorderFaqsDto) {
    const updatePromises = dto.items.map((item) =>
      this.prisma.fAQ.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );

    await this.prisma.$transaction(updatePromises);

    return {
      updated: dto.items.length,
      message: 'FAQ order updated successfully',
    };
  }
}
