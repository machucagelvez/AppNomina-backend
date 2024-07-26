import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  first_name: string;

  @IsString()
  @MinLength(2)
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  document: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
