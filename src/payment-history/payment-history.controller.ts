import { Controller, Post, Body } from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { Auth } from 'src/auth/dto';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators';
import { CalculatePaymentDto } from './dto/calculate-payment.dto';

@Controller('payment')
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {}

  @Post('calculate')
  @Auth(ValidRoles.user)
  calculatePayment(
    @Body() calculatePaymentDto: CalculatePaymentDto,
    @GetUser() user: User,
  ) {
    return this.paymentHistoryService.calculatePayment(
      calculatePaymentDto,
      user,
    );
  }
}
