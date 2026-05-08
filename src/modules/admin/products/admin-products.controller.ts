import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryProductsDto) {
    return this.adminProductsService.findAll(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProductDto) {
    return this.adminProductsService.create(dto);
  }

  @Post(':id/images')
  @HttpCode(HttpStatus.OK)
  async addImage(@Param('id') id: string, @Body() dto: UploadImageDto) {
    return this.adminProductsService.addImage(id, dto);
  }

  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string) {
    return this.adminProductsService.publish(id);
  }

  @Patch(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublish(@Param('id') id: string) {
    return this.adminProductsService.unpublish(id);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: string) {
    return this.adminProductsService.archive(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.adminProductsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.adminProductsService.update(id, dto);
  }
}
