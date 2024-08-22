import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';

export class CreateVacationDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  end_date: Date;

  @ApiProperty()
  @IsUUID()
  employeeId: string;
}
