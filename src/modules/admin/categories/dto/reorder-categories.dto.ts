import { IsArray, ValidateNested, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryOrderItem {
  @IsString()
  id!: string;

  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class ReorderCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryOrderItem)
  items!: CategoryOrderItem[];
}
