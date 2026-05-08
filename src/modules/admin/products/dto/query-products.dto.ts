import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class QueryProductsDto {
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
