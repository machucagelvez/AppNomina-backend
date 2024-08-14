import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationService } from './vacation.service';
import { VacationController } from './vacation.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Vacation } from './entities/vacation.entity';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  controllers: [VacationController],
  providers: [VacationService],
  imports: [TypeOrmModule.forFeature([Vacation]), AuthModule, EmployeesModule],
})
export class VacationModule {}
