import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from '../interfaces';

export class FiltersDto extends PaginationDto {
  @ApiProperty({ description: 'User status' })
  @IsOptional()
  @IsIn([0, 1])
  @Type(() => Number)
  status?: number;

  // @ApiProperty({ description: 'User role' })
  // @IsOptional()
  // @IsEnum(ValidRoles)
  // role?: ValidRoles;
}
