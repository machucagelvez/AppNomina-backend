import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  addDays,
  addYears,
  differenceInDays,
  differenceInYears,
  format,
  parseISO,
} from 'date-fns';
const Holidays = require('date-holidays');
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class VacationService {
  private readonly logger = new Logger('VacationService');

  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,

    @Inject(forwardRef(() => EmployeesService))
    private readonly employeesService: EmployeesService,
    private readonly dataSource: DataSource,
    private readonly commonService: CommonService,
  ) {}

  async create(createVacationDto: CreateVacationDto, user: User) {
    const { employeeId } = createVacationDto;
    const employee = await this.employeesService.findOne(employeeId, user);
    const newStartDate = createVacationDto.start_date;
    const newEndDate = createVacationDto.end_date;
    const { pendingVacationDays } = await this.getVacationDays(employeeId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const last_vacation = await this.vacationRepository.findOneBy({
        employee: { id: employeeId },
        last_taken: true,
      });

      const updateLastTaken = this.validations(
        last_vacation,
        newStartDate,
        newEndDate,
        pendingVacationDays,
      );
      if (updateLastTaken) {
        await queryRunner.manager.update(Vacation, last_vacation.id, {
          last_taken: false,
        });
      }

      const vacation = queryRunner.manager.create(Vacation, {
        ...createVacationDto,
        employee,
      });

      await queryRunner.manager.save(vacation);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return vacation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.commonService.errorHandler(error);
    }
  }

  async findAll(paginationDto: PaginationDto, employeeId: string) {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;
    const vacations = await this.vacationRepository.find({
      where: { employee: { id: employeeId } },
      take: limit,
      skip: offset,
      order: { end_date: 'ASC', last_taken: 'ASC' },
    });
    return vacations;
  }

  async findOne(id: number) {
    const vacation = await this.vacationRepository.findOneBy({ id });
    if (!vacation) throw new NotFoundException('Vacation not found');

    return vacation;
  }

  async update(id: number, updateVacationDto: UpdateVacationDto) {
    const currentVacation = await this.findOne(id);
    const vacation = await this.vacationRepository.preload({
      id,
      ...updateVacationDto,
    });

    if (!currentVacation.last_taken)
      throw new ForbiddenException('Past periods cannot be modified');

    const allVacations = await this.findAll(
      { limit: 1000, page: 1 },
      currentVacation.employee.id,
    );

    const lastVacation =
      allVacations.length === 1
        ? undefined
        : allVacations[allVacations.length - 2];

    const endDate = vacation.end_date;
    const startDate = vacation.start_date;
    const { pendingVacationDays } = await this.getVacationDays(
      currentVacation.employee.id,
      true,
    );

    this.validations(lastVacation, startDate, endDate, pendingVacationDays);

    try {
      await this.vacationRepository.update(id, { ...updateVacationDto });
      return currentVacation;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async remove(id: number) {
    const vacation = await this.findOne(id);
    const startDate = new Date(vacation.start_date);
    const endDate = new Date(vacation.end_date);
    const today = new Date();
    if (endDate < today)
      throw new ForbiddenException('Cannot delete a past period');

    if (startDate <= today)
      throw new ForbiddenException('Cannot delete a current period');

    try {
      await this.vacationRepository.delete(id);
      return 'Vacation deleted';
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async getVacationDays(employeeId: string, updating: boolean = false) {
    const vacations = await this.findAll({ limit: 1000, page: 1 }, employeeId);

    if (vacations.length === 0 && updating)
      throw new NotFoundException('Vacation not found');

    let returnDay: string = null;
    const today = format(new Date(), 'yyyy-MM-dd');
    if (vacations.length > 0) {
      const lastVacation = vacations[vacations.length - 1];
      const endDate = lastVacation.end_date;

      if (updating) vacations.pop();
      if (endDate >= today)
        returnDay = format(addDays(parseISO(endDate), 1), 'yyyy-MM-dd');
    }

    const employeeStartDate =
      await this.employeesService.getStartDate(employeeId);

    const takenVacationDays = vacations.reduce((sum, vacation) => {
      const workingDays = this.getWorkingDays(
        vacation.start_date,
        vacation.end_date,
      );
      return sum + workingDays;
    }, 0);

    const workedYears = differenceInYears(today, employeeStartDate);
    const nextDate = addYears(employeeStartDate, workedYears);
    const workedDays = differenceInDays(today, nextDate);
    const totalVacationDays = Math.floor(
      workedYears * 15 + (workedDays * 15) / 360,
    );

    const pendingVacationDays = totalVacationDays - takenVacationDays;

    return {
      totalVacationDays,
      takenVacationDays,
      pendingVacationDays,
      returnDay,
    };
  }

  private getWorkingDays(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hd = new Holidays('CO');
    const days = differenceInDays(end, start) + 1;
    let workingDays = 0;
    let currentDay = start;
    for (let i = 0; i < days; i++) {
      const workingDay =
        currentDay.getUTCDay() === 0 ||
        currentDay.getUTCDay() === 6 ||
        hd.isHoliday(currentDay)
          ? false
          : true;
      if (workingDay) workingDays++;
      currentDay = addDays(currentDay, 1);
    }

    return workingDays;
  }

  private validations(
    lastVacation: Vacation | undefined,
    newStartDate: string,
    newEndDate: string,
    pendingVacationDays: number,
  ) {
    const requestedDays = this.getWorkingDays(newStartDate, newEndDate);

    if (requestedDays > pendingVacationDays)
      throw new BadRequestException(
        `Requested days exceed available days (${pendingVacationDays})`,
      );

    const today = new Date();
    let updateLastTaken = false;
    if (newStartDate > newEndDate)
      throw new BadRequestException('Invalid period');

    if (lastVacation) {
      const lastEndDate = lastVacation.end_date;

      if (newStartDate <= lastEndDate)
        throw new BadRequestException('Overlapping periods');

      const nextDay = addDays(new Date(lastEndDate), 1);
      if (nextDay >= new Date(today))
        throw new ForbiddenException('The current period has not ended');

      updateLastTaken = true;
    }
    return updateLastTaken;
  }
}
