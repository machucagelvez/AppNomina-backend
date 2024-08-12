import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationService } from './vacation.service';
import { VacationController } from './vacation.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Vacation } from './entities/vacation.entity';

@Module({
  controllers: [VacationController],
  providers: [VacationService],
  imports: [TypeOrmModule.forFeature([Vacation]), AuthModule],
})
export class VacationModule {}
