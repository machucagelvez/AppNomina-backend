import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalValue } from './entities/legal-value.entity';
import { CreateLegalValueDto } from './dto/create-legal-value.dto';
import { UpdateLegalValueDto } from './dto/update-legal-value.dto';

@Injectable()
export class LegalValuesService {
  private readonly logger = new Logger('LegalValuesService');

  constructor(
    @InjectRepository(LegalValue)
    private readonly legalValueRepository: Repository<LegalValue>,
  ) {}
  async create(createLegalValueDto: CreateLegalValueDto) {
    try {
      const legalValues = this.legalValueRepository.create(createLegalValueDto);
      await this.legalValueRepository.save(legalValues);
      return legalValues;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return `This action returns all legalValues`;
  }

  async findOne(id: number) {
    const legalValues = await this.legalValueRepository.findOneBy({ id });
    if (!legalValues) throw new NotFoundException('LegalValue not found');

    return legalValues;
  }

  update(id: number, updateLegalValueDto: UpdateLegalValueDto) {
    return `This action updates a #${id} legalValue`;
  }

  remove(id: number) {
    return `This action removes a #${id} legalValue`;
  }

  private handleDBErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
