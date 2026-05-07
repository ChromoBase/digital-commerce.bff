import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ProductListResponse,
  ProductDetailResponse,
} from './types/product-response.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
  ): Promise<ProductListResponse[]> {
    const isFeatured =
      featured === 'true' ? true : featured === 'false' ? false : undefined;
    return this.productsService.findAll(category, isFeatured);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<ProductDetailResponse> {
    return this.productsService.findOne(slug);
  }
}
