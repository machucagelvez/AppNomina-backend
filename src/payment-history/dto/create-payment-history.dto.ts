import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreatePaymentHistoryDto {
  @ApiProperty()
  @IsDateString()
  start_period: string;

  @ApiProperty()
  @IsDateString()
  end_period: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  period_salary: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  pension_discount: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  health_insurance_discount: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  transportation_assistance?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  total_surcharges?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  total_overtime?: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  employeeId?: string;
}
