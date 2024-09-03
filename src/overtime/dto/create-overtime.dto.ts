import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateOvertimeDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  hours: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  value?: number;

  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  paymentHistoryId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  overtimeTypeId: number;
}
