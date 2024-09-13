import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
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
  @IsDateString()
  start_date: string;

  @ApiProperty()
  @IsDateString()
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

  @ApiProperty()
  @IsIn(['first', 'last', 'both', null])
  discount_date: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  contractId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  paymentFrequencyId: number;
}
