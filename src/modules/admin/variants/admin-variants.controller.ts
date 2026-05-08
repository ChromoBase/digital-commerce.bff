import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminVariantsService } from './admin-variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('admin/products/:productId/variants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminVariantsController {
  constructor(private readonly adminVariantsService: AdminVariantsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('productId') productId: string) {
    return this.adminVariantsService.findAllByProduct(productId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('productId') productId: string,
    @Body() dto: CreateVariantDto,
  ) {
    return this.adminVariantsService.create(productId, dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.adminVariantsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.adminVariantsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.adminVariantsService.remove(id);
  }

  @Patch(':id/stock')
  @HttpCode(HttpStatus.OK)
  async updateStock(@Param('id') id: string, @Body('stock') stock: number) {
    return this.adminVariantsService.updateStock(id, stock);
  }
}
