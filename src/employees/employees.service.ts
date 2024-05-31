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

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger('EmployeesService');

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const employee = this.employeeRepository.create(createEmployeeDto);
      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 0 } = paginationDto;
    const offset = (page - 1) * limit;
    const employees = await this.employeeRepository.find({
      where: { status: true },
      take: limit,
      skip: offset,
    });
    return employees;
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOneBy({
      id,
      status: true,
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.employeeRepository.update(id, { status: false });
    return 'Employee deleted';
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
