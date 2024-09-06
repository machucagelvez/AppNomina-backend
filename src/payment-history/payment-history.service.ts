import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfMonth, format, setDate, startOfMonth } from 'date-fns';
import { EmployeesService } from 'src/employees/employees.service';
import { LegalValuesService } from 'src/legal-values/legal-values.service';
import { User } from 'src/auth/entities/user.entity';
import { PaymentHistory } from './entities/payment-history.entity';
import { CreatePaymentHistoryDto } from './dto/create-payment-history.dto';
import { UpdatePaymentHistoryDto } from './dto/update-payment-history.dto';
import { CalculatePaymentDto } from './dto/calculate-payment.dto';
import { OvertimeService } from 'src/overtime/overtime.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class PaymentHistoryService {
  private readonly logger = new Logger('PaymentHistoryService');
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentHistoryRepository: Repository<PaymentHistory>,

    private readonly employeesService: EmployeesService,
    private readonly legalValuesService: LegalValuesService,
    private readonly overtimeService: OvertimeService,
    private readonly commonService: CommonService,
  ) {}
  async calculatePayment(calculatePaymentDto: CalculatePaymentDto, user: User) {
    const { employeeId, paymentHistoryId } = calculatePaymentDto;
    const { paymentFrequency, salary, discount_date } =
      await this.employeesService.findOne(employeeId, user);

    const legalValues = await this.legalValuesService.findValues();
    const today = new Date();

    const paymentData: CreatePaymentHistoryDto = {
      period_salary: salary,
      pension_discount: salary * legalValues.pension_percentage,
      health_insurance_discount:
        salary * legalValues.health_insurance_percentage,
      transportation_assistance: 0,
      start_period: format(startOfMonth(today), 'yyyy-MM-dd'),
      end_period: format(endOfMonth(today), 'yyyy-MM-dd'),
    };

    if (salary <= legalValues.minimum_wage * 2)
      paymentData.transportation_assistance =
        legalValues.transportation_assistance;

    if (paymentFrequency.id === 2) {
      if (discount_date === 'both') {
        paymentData.pension_discount = paymentData.pension_discount / 2;
        paymentData.health_insurance_discount =
          paymentData.health_insurance_discount / 2;
      }

      if (today.getDate() >= 0 && today.getDate() <= 15) {
        paymentData.end_period = format(setDate(today, 15), 'yyyy-MM-dd');

        if (discount_date === 'last') {
          paymentData.pension_discount = 0;
          paymentData.health_insurance_discount = 0;
        }
      } else {
        paymentData.start_period = format(setDate(today, 16), 'yyyy-MM-dd');

        if (discount_date === 'first') {
          paymentData.pension_discount = 0;
          paymentData.health_insurance_discount = 0;
        }
      }

      paymentData.transportation_assistance =
        paymentData.transportation_assistance / 2;
      paymentData.period_salary = salary / 2;
    }

    try {
      let payment: PaymentHistory;
      if (!paymentHistoryId) {
        const paymentExists = await this.paymentHistoryRepository.findOne({
          where: {
            employee: { id: employeeId },
            start_period: paymentData.start_period,
          },
        });
        if (paymentExists)
          throw new BadRequestException('Payment already exists');

        payment = await this.create({ ...paymentData, employeeId });
      } else {
        const surcharges = await this.overtimeService.findAll({
          category: 'surcharge',
          paymentHistoryId,
        });
        const overtime = await this.overtimeService.findAll({
          category: 'overtime',
          paymentHistoryId,
        });

        const totalSurcharges = surcharges.reduce((sum, surcharge) => {
          return sum + surcharge.value;
        }, 0);
        const totalOvertime = overtime.reduce((sum, ot) => {
          return sum + ot.value;
        }, 0);

        paymentData.total_surcharges = totalSurcharges;
        paymentData.total_overtime = totalOvertime;

        payment = await this.update(paymentHistoryId, employeeId, {
          ...paymentData,
        });
      }
      const total =
        payment.period_salary -
        payment.pension_discount -
        payment.health_insurance_discount +
        payment.transportation_assistance +
        payment.total_surcharges +
        payment.total_overtime;

      return { baseSalary: salary, ...payment, total };
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async create(createPaymentHistoryDto: CreatePaymentHistoryDto) {
    const { employeeId, ...paymentHistoryData } = createPaymentHistoryDto;
    try {
      const payment = this.paymentHistoryRepository.create({
        ...paymentHistoryData,
        employee: { id: employeeId },
      });
      await this.paymentHistoryRepository.save(payment);
      return payment;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async update(
    id: number,
    employeeId: string,
    updatePaymentHistoryDto: UpdatePaymentHistoryDto,
  ) {
    const payment = await this.paymentHistoryRepository.findOne({
      where: { id, employee: { id: employeeId } },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    try {
      await this.paymentHistoryRepository.update(id, updatePaymentHistoryDto);
      return payment;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }
}
