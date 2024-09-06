import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationService } from './vacation.service';
import { VacationController } from './vacation.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Vacation } from './entities/vacation.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [VacationController],
  providers: [VacationService],
  imports: [
    TypeOrmModule.forFeature([Vacation]),
    AuthModule,
    forwardRef(() => EmployeesModule),
    CommonModule,
  ],
  exports: [VacationService],
})
export class VacationModule {}
