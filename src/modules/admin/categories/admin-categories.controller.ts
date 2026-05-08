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
import { AdminCategoriesService } from './admin-categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminCategoriesController {
  constructor(
    private readonly adminCategoriesService: AdminCategoriesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.adminCategoriesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCategoryDto) {
    return this.adminCategoriesService.create(dto);
  }

  @Patch('reorder')
  @HttpCode(HttpStatus.OK)
  async reorder(@Body() dto: ReorderCategoriesDto) {
    return this.adminCategoriesService.reorder(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.adminCategoriesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.adminCategoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.adminCategoriesService.remove(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string) {
    return this.adminCategoriesService.activate(id);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string) {
    return this.adminCategoriesService.deactivate(id);
  }
}
