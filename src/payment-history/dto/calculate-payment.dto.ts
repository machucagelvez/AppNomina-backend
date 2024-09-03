import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CalculatePaymentDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  paymentHistoryId?: number;
}
