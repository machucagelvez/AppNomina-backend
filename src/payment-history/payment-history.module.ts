import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistoryService } from './payment-history.service';
import { PaymentHistoryController } from './payment-history.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentHistory } from './entities/payment-history.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { LegalValuesModule } from 'src/legal-values/legal-values.module';
import { OvertimeModule } from 'src/overtime/overtime.module';

@Module({
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService],
  imports: [
    TypeOrmModule.forFeature([PaymentHistory]),
    AuthModule,
    EmployeesModule,
    LegalValuesModule,
    OvertimeModule,
  ],
})
export class PaymentHistoryModule {}
