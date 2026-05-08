import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { UpdateStorefrontSettingsDto } from './dto/update-storefront-settings.dto';

@Injectable()
export class AdminStorefrontService {
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

  async getSettings() {
    const storeId = await this.getStoreId();

    const settings = await this.prisma.storefrontSettings.findUnique({
      where: { storeId },
    });

    if (!settings) {
      throw new NotFoundException('Storefront settings not found');
    }

    return settings;
  }

  async updateSettings(dto: UpdateStorefrontSettingsDto) {
    const storeId = await this.getStoreId();

    return this.prisma.storefrontSettings.update({
      where: { storeId },
      data: dto,
    });
  }
}
