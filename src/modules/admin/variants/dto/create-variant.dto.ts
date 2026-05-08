import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  priceCents?: number;
}
