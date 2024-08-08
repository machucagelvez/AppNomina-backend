import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './entities/employee.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Contract } from './entities/contract.entity';
import { PaymentFrequency } from './entities/payment-frequency.entity';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [
    TypeOrmModule.forFeature([Employee, Contract, PaymentFrequency]),
    AuthModule,
  ],
})
export class EmployeesModule {}
