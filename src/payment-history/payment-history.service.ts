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

@Injectable()
export class PaymentHistoryService {
  private readonly logger = new Logger('PaymentHistoryService');
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentHistoryRepository: Repository<PaymentHistory>,

    private readonly employeesService: EmployeesService,
    private readonly legalValuesService: LegalValuesService,
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

    switch (paymentFrequency.id) {
      case 1:
        break;

      case 2:
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
        break;
    }

    let payment: PaymentHistory;
    if (!paymentHistoryId) {
      payment = await this.create({ ...paymentData, employeeId });
    } else {
      // TODO: extra time logic
      payment = await this.update(paymentHistoryId, { ...paymentData });
    }

    const total =
      paymentData.period_salary -
      paymentData.pension_discount -
      paymentData.health_insurance_discount +
      paymentData.transportation_assistance;

    return { ...payment, total };
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
      this.handleDBErrors(error);
    }
  }

  async update(id: number, updatePaymentHistoryDto: UpdatePaymentHistoryDto) {
    const payment = await this.paymentHistoryRepository.preload({
      id,
      ...updatePaymentHistoryDto,
    });
    if (!payment) throw new NotFoundException('Payment not found');

    try {
      await this.paymentHistoryRepository.save(payment);
      return payment;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
