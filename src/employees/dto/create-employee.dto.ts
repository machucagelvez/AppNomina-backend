import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(2)
  first_name: string;

  @IsString()
  @MinLength(2)
  last_name: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  @MinLength(6)
  document: string;

  @IsString()
  eps: string;

  @IsString()
  afp: string;

  @IsString()
  ccf: string;

  @IsNumber()
  @IsPositive()
  salary: number;

  @IsDate()
  @Type(() => Date)
  start_date: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  photo?: string;
}
