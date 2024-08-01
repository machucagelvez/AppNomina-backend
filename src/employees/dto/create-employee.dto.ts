import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  first_name: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  last_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumberString()
  @MinLength(6)
  document: string;

  @ApiProperty()
  @IsIn(['cc', 'ce', 'nit'])
  document_type: string;

  @ApiProperty()
  @IsString()
  eps: string;

  @ApiProperty()
  @IsString()
  afp: string;

  @ApiProperty()
  @IsString()
  ccf: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  salary: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  start_date: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photo?: string;
}
