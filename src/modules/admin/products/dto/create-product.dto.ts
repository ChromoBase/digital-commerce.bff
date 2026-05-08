import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase, alphanumeric, with hyphens only (e.g., sony-a7-iv)',
  })
  slug!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(0)
  priceCents!: number;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
