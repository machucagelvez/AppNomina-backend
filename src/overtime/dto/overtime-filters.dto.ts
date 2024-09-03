import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class OvertimeFiltersDto {
  @ApiProperty({ description: 'Overtime category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Payment ID' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  paymentHistoryId?: number;
}
