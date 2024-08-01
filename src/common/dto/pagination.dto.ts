import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'Number of results' })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ description: 'Page to show' })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;
}
