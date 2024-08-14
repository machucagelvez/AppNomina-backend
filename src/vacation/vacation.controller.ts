import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VacationService } from './vacation.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/dto';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Vacations')
@ApiBearerAuth()
@Controller('vacation')
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(@Body() createVacationDto: CreateVacationDto, @GetUser() user: User) {
    return this.vacationService.create(createVacationDto, user);
  }

  @Get('employee/:employeeId')
  @Auth(ValidRoles.user)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ) {
    return this.vacationService.findAll(paginationDto, employeeId);
  }

  @Get(':id')
  @Auth(ValidRoles.user)
  findOne(@Param('id') id: string) {
    return this.vacationService.findOne(+id);
  }

  // Pending removal or approval
  @Patch(':id')
  @Auth(ValidRoles.user)
  update(
    @Param('id') id: string,
    @Body() updateVacationDto: UpdateVacationDto,
  ) {
    return this.vacationService.update(+id, updateVacationDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.user)
  remove(@Param('id') id: string) {
    return this.vacationService.remove(+id);
  }

  @Get('employee/:employeeId/days')
  @Auth(ValidRoles.user)
  getVacationDays(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.vacationService.getVacationDays(employeeId);
  }
}
