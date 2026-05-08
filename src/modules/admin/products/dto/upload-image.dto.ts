import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class UploadImageDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl!: string;
}
