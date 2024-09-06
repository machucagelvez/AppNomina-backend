import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistoryService } from './payment-history.service';
import { PaymentHistoryController } from './payment-history.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentHistory } from './entities/payment-history.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { LegalValuesModule } from 'src/legal-values/legal-values.module';
import { OvertimeModule } from 'src/overtime/overtime.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService],
  imports: [
    TypeOrmModule.forFeature([PaymentHistory]),
    AuthModule,
    EmployeesModule,
    LegalValuesModule,
    OvertimeModule,
    CommonModule,
  ],
})
export class PaymentHistoryModule {}
