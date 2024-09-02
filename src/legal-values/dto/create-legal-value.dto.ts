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
  transportation_assistance: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  minimum_wage: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  severance_pay_interest: number;
}
