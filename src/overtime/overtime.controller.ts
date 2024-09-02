import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { Auth } from 'src/auth/dto';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(@Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimeService.create(createOvertimeDto);
  }

  @Get()
  findAll() {
    return this.overtimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overtimeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOvertimeDto: UpdateOvertimeDto,
  ) {
    return this.overtimeService.update(+id, updateOvertimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.overtimeService.remove(+id);
  }
}
