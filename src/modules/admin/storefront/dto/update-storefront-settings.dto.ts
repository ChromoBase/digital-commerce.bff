import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';
import { MediaType } from '@prisma/client';

export class UpdateStorefrontSettingsDto {
  @IsEnum(MediaType)
  @IsOptional()
  heroMediaType?: MediaType;

  @IsString()
  @IsOptional()
  heroMediaUrl?: string;

  @IsString()
  @IsOptional()
  heroPosterUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  heroTitle?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  heroSubtitle?: string;

  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Primary color must be a valid hex color (#RRGGBB or #RGB)',
  })
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Secondary color must be a valid hex color (#RRGGBB or #RGB)',
  })
  @IsOptional()
  secondaryColor?: string;
}
