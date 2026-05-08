import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(10, {
    message: 'Password must be at least 10 characters long',
  })
  @MaxLength(72, {
    message: 'Password must not exceed 72 characters',
  })
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;
}
