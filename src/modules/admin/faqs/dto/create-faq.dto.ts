import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsString()
  @IsNotEmpty()
  answer!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
