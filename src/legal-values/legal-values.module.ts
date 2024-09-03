import { Module } from '@nestjs/common';
import { LegalValuesService } from './legal-values.service';
import { LegalValuesController } from './legal-values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalValue } from './entities/legal-value.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [LegalValuesController],
  providers: [LegalValuesService],
  imports: [TypeOrmModule.forFeature([LegalValue]), CommonModule],
  exports: [LegalValuesService],
})
export class LegalValuesModule {}
