import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { VacationService } from 'src/vacation/vacation.service';
import { Contract } from './entities/contract.entity';
import { PaymentFrequency } from './entities/payment-frequency.entity';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger('EmployeesService');

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,

    @InjectRepository(PaymentFrequency)
    private readonly paymentFrequency: Repository<PaymentFrequency>,

    @Inject(forwardRef(() => VacationService))
    private readonly vacationService: VacationService,

    private readonly commonService: CommonService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, user: User) {
    const { contractId, paymentFrequencyId, ...employeeData } =
      createEmployeeDto;
    try {
      const employee = this.employeeRepository.create({
        ...employeeData,
        user,
        contract: { id: contractId },
        paymentFrequency: { id: paymentFrequencyId },
      });
      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      this.commonService.errorHandler(error);
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

    const vacationsDays = await this.vacationService.getVacationDays(id);

    return { ...employee, vacationsDays };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto, user: User) {
    const employee = await this.findOne(id, user);
    if (!employee) throw new NotFoundException('Employee not found');

    try {
      await this.employeeRepository.update(id, { ...updateEmployeeDto });
      return employee;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async remove(id: string, user: User) {
    await this.findOne(id, user);
    await this.employeeRepository.update(id, { status: false });
    return 'Employee deleted';
  }

  async getStartDate(id: string) {
    const employeeStartDate = await this.employeeRepository
      .createQueryBuilder('employee')
      .select('employee.start_date')
      .where({ id })
      .getOne();

    if (!employeeStartDate) throw new NotFoundException('Employee not found');
    const { start_date } = employeeStartDate;

    return start_date;
  }

  async createContractType(name: string) {
    try {
      const contract = this.contractRepository.create({
        name,
      });
      await this.contractRepository.save(contract);
      return contract;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async createPaymentFrequency(name: string) {
    try {
      const paymentFrequency = this.paymentFrequency.create({
        name,
      });
      await this.paymentFrequency.save(paymentFrequency);
      return paymentFrequency;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }
}
