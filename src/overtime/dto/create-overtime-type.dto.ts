import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOvertimeTypeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  percentage: number;

  @ApiProperty()
  @IsString()
  @IsIn(['surcharge', 'overtime'])
  category: string;
}
