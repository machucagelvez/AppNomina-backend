import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalValue } from './entities/legal-value.entity';
import { CreateLegalValueDto } from './dto/create-legal-value.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class LegalValuesService {
  private readonly logger = new Logger('LegalValuesService');

  constructor(
    @InjectRepository(LegalValue)
    private readonly legalValueRepository: Repository<LegalValue>,

    private readonly commonService: CommonService,
  ) {}
  async create(createLegalValueDto: CreateLegalValueDto) {
    try {
      const legalValues = this.legalValueRepository.create(createLegalValueDto);
      await this.legalValueRepository.save(legalValues);
      return legalValues;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async findValues() {
    const legalValues = await this.legalValueRepository.findOneBy({ id: 1 });
    if (!legalValues) throw new NotFoundException('LegalValue not found');

    return legalValues;
  }
}
