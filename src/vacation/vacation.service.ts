import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class VacationService {
  private readonly logger = new Logger('VacationService');

  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    private readonly employeeRepository: EmployeesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createVacationDto: CreateVacationDto, user: User) {
    const { employeeId } = createVacationDto;
    const employee = await this.employeeRepository.findOne(employeeId, user);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const last_vacation = await this.vacationRepository.findOneBy({
        employee: { id: employeeId },
        last_taken: true,
      });

      if (last_vacation) {
        const lastEndDate = new Date(last_vacation.end_date);
        const newStartDate = new Date(`${createVacationDto.start_date}`);
        const newEndDate = new Date(`${createVacationDto.end_date}`);
        const today = new Date();

        if (newStartDate <= lastEndDate || newStartDate > newEndDate)
          throw new BadRequestException('Invalid period');

        if (lastEndDate >= today)
          throw new ForbiddenException('The current period has not ended');

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
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto, employeeId: string) {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;
    const vacations = await this.vacationRepository.find({
      where: { employee: { id: employeeId } },
      take: limit,
      skip: offset,
    });
    return vacations;
  }

  async findOne(id: number) {
    const vacation = await this.vacationRepository.findOneBy({ id });
    if (!vacation) throw new NotFoundException('Vacation not found');

    return vacation;
  }

  async update(id: number, updateVacationDto: UpdateVacationDto) {
    const vacation = await this.vacationRepository.preload({
      id,
      ...updateVacationDto,
    });
    if (!vacation) throw new NotFoundException('Vacation not found');

    const endDate = new Date(`${vacation.end_date}`);
    const startDate = new Date(`${vacation.start_date}`);
    if (endDate <= startDate) throw new BadRequestException('Invalid period');

    try {
      await this.vacationRepository.save(vacation);
      return vacation;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const vacation = await this.findOne(id);
    if (vacation.last_taken === false)
      throw new ForbiddenException('Cannot delete past periods');

    try {
      await this.vacationRepository.delete(id);
      return 'Vacation deleted';
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.status) throw error;

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
