import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CategoryResponse,
  CategoryProductsResponse,
} from './types/category-response.types';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<CategoryResponse[]> {
    return this.categoriesService.findAll();
  }

  @Get(':slug/products')
  findCategoryProducts(
    @Param('slug') slug: string,
  ): Promise<CategoryProductsResponse> {
    return this.categoriesService.findCategoryProducts(slug);
  }
}
