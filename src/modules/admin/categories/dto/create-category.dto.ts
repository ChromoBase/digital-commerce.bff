import {
  IsString,
  IsBoolean,
  IsInt,
  Min,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase, alphanumeric, with hyphens only (e.g., digital-cameras)',
  })
  slug!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isVisibleHome?: boolean = false;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number = 0;
}
