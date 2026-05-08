import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminStorefrontService } from './admin-storefront.service';
import { UpdateStorefrontSettingsDto } from './dto/update-storefront-settings.dto';

@Controller('admin/storefront')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminStorefrontController {
  constructor(
    private readonly adminStorefrontService: AdminStorefrontService,
  ) {}

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  async getSettings() {
    return this.adminStorefrontService.getSettings();
  }

  @Patch('settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Body() dto: UpdateStorefrontSettingsDto) {
    return this.adminStorefrontService.updateSettings(dto);
  }
}
