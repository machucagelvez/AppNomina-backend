import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreatePaymentHistoryDto {
  @ApiProperty()
  @IsDate()
  start_period: string;

  @ApiProperty()
  @IsDate()
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
  night_surcharge?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  holiday_night_surcharge?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  holiday_daytime_surcharge?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  night_overtime?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  daytime_overtime?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  holiday_night_overtime?: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  holiday_daytime_overtime?: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  employeeId?: string;
}
