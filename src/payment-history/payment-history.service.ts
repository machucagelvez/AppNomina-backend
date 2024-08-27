import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmployeesService } from 'src/employees/employees.service';
import { LegalValuesService } from 'src/legal-values/legal-values.service';
import { User } from 'src/auth/entities/user.entity';
import { Payment } from './interfaces/payment.interface';
import { eliminateTimeZone } from 'src/common/helpers/eliminate-time-zone';
import { endOfMonth, format, setDate, startOfMonth } from 'date-fns';

@Injectable()
export class PaymentHistoryService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly legalValuesService: LegalValuesService,
  ) {}
  async calculatePayment(employeeId: string, user: User) {
    const { paymentFrequency, salary, discount_date } =
      await this.employeesService.findOne(employeeId, user);

    const legalValues = await this.legalValuesService.findOne(1);

    const payment: Payment = {
      baseSalary: salary,
      pensionDiscount: salary * legalValues.pension_percentage,
      healthInsuranceDiscount: salary * legalValues.health_insurance_percentage,
      transportationAssistance: 0,
    };

    const today = eliminateTimeZone(new Date());
    let firstDay = format(startOfMonth(today), 'dd/MM/yyyy');
    let lastDay = format(endOfMonth(today), 'dd/MM/yyyy');

    if (salary <= legalValues.minimum_wage * 2)
      payment.transportationAssistance = legalValues.transportation_assistance;

    switch (paymentFrequency.id) {
      case 1:
        payment.period = `${firstDay} - ${lastDay}`;

      case 2:
        if (discount_date === 'both') {
          payment.pensionDiscount = payment.pensionDiscount / 2;
          payment.healthInsuranceDiscount = payment.healthInsuranceDiscount / 2;
        }
        if (today.getDate() >= 0 && today.getDate() <= 15) {
          lastDay = format(setDate(today, 15), 'dd/MM/yyyy');

          if (discount_date === 'last') {
            payment.pensionDiscount = 0;
            payment.healthInsuranceDiscount = 0;
          }
        } else {
          firstDay = format(setDate(today, 16), 'dd/MM/yyyy');

          if (discount_date === 'first') {
            payment.pensionDiscount = 0;
            payment.healthInsuranceDiscount = 0;
          }
        }

        payment.transportationAssistance = payment.transportationAssistance / 2;
        payment.period = `${firstDay} - ${lastDay}`;
        payment.baseSalary = salary / 2;
    }

    payment.total =
      payment.baseSalary -
      payment.pensionDiscount -
      payment.healthInsuranceDiscount +
      payment.transportationAssistance;
    return payment;
  }
}
