import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { Auth } from 'src/auth/dto';
import { ValidRoles } from 'src/auth/interfaces';
import { OvertimeFiltersDto } from './dto/overtime-filters.dto';

@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(@Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimeService.create(createOvertimeDto);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll(@Query() overtimeFiltersDto: OvertimeFiltersDto) {
    return this.overtimeService.findAll(overtimeFiltersDto);
  }
}
