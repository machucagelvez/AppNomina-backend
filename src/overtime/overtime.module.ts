import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { Overtime } from './entities/overtime.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OvertimeType } from './entities/overtime-type.entity';
import { LegalValuesModule } from 'src/legal-values/legal-values.module';

@Module({
  controllers: [OvertimeController],
  providers: [OvertimeService],
  imports: [
    TypeOrmModule.forFeature([Overtime, OvertimeType]),
    AuthModule,
    LegalValuesModule,
  ],
  exports: [OvertimeService],
})
export class OvertimeModule {}
