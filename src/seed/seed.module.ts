import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { LegalValuesModule } from 'src/legal-values/legal-values.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, EmployeesModule, LegalValuesModule],
})
export class SeedModule {}
