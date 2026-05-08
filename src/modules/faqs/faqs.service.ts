import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FaqsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async findAllActive() {
    const storeSlug = this.config.get<string>('DEFAULT_STORE_SLUG');
    const store = await this.prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      return [];
    }

    const faqs = await this.prisma.fAQ.findMany({
      where: {
        storeId: store.id,
        isActive: true,
      },
      select: {
        id: true,
        question: true,
        answer: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return faqs;
  }
}
