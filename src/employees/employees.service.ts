import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger('EmployeesService');

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, user: User) {
    try {
      const employee = this.employeeRepository.create({
        ...createEmployeeDto,
        user,
      });
      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;
    const employees = await this.employeeRepository.find({
      where: { status: true, user: { id: user.id } },
      take: limit,
      skip: offset,
    });
    return employees;
  }

  async findOne(id: string, user: User) {
    const employee = await this.employeeRepository.findOneBy({
      id,
      status: true,
      user: { id: user.id },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto, user: User) {
    await this.findOne(id, user);
    const employee = await this.employeeRepository.preload({
      id,
      ...updateEmployeeDto,
    });

    if (!employee) throw new NotFoundException('Employee not found');

    try {
      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string, user: User) {
    await this.findOne(id, user);
    await this.employeeRepository.update(id, { status: false });
    return 'Employee deleted';
  }

  private handleDBErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
