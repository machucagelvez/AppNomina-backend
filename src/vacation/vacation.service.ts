import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { EmployeesService } from 'src/employees/employees.service';

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

        if (newStartDate <= lastEndDate || newStartDate > newEndDate)
          throw new BadRequestException('Invalid period');

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

  findAll() {
    return `This action returns all vacation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacation`;
  }

  update(id: number, updateVacationDto: UpdateVacationDto) {
    return `This action updates a #${id} vacation`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacation`;
  }

  private handleDBErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.status) throw error;

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
