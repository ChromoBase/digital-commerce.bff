import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

class ReorderFaqItem {
  @IsString()
  id!: string;

  @IsNumber()
  @Min(0)
  sortOrder!: number;
}

export class ReorderFaqsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderFaqItem)
  items!: ReorderFaqItem[];
}
