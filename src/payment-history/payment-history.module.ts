import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistoryService } from './payment-history.service';
import { PaymentHistoryController } from './payment-history.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentHistory } from './entities/payment-history.entity';

@Module({
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService],
  imports: [TypeOrmModule.forFeature([PaymentHistory]), AuthModule],
})
export class PaymentHistoryModule {}
