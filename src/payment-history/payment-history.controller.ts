import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentHistoryService } from './payment-history.service';
import { CreatePaymentHistoryDto } from './dto/create-payment-history.dto';
import { UpdatePaymentHistoryDto } from './dto/update-payment-history.dto';
import { Auth } from 'src/auth/dto';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators';

@Controller('payment')
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {}

  @Get(':employeeId')
  @Auth(ValidRoles.user)
  calculatePayment(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @GetUser() user: User,
  ) {
    return this.paymentHistoryService.calculatePayment(employeeId, user);
  }
}
