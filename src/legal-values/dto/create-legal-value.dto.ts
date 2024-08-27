import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateLegalValueDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  pension_percentage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  health_insurance_percentage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  transport_subsidy: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  severance_pay_interest: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  night_surcharge_percentage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  holiday_night_surcharge_percentage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  holiday_daytime_surcharge_percentage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  night_overtime_percentage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  daytime_overtime_percentage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  holiday_night_overtime_percentage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  holiday_daytime_overtime_percentage: number;
}
