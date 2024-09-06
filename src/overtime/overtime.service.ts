import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OvertimeType } from './entities/overtime-type.entity';
import { Repository } from 'typeorm';
import { Overtime } from './entities/overtime.entity';
import { CreateOvertimeTypeDto } from './dto/create-overtime-type.dto';
import { LegalValuesService } from 'src/legal-values/legal-values.service';
import { OvertimeFiltersDto } from './dto/overtime-filters.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class OvertimeService {
  private readonly logger = new Logger('OvertimeService');
  constructor(
    @InjectRepository(Overtime)
    private readonly overtimeRepository: Repository<Overtime>,

    @InjectRepository(OvertimeType)
    private readonly overtimeTypeRepository: Repository<OvertimeType>,

    private readonly legalValuesService: LegalValuesService,
    private readonly commonService: CommonService,
  ) {}
  async create(createOvertimeDto: CreateOvertimeDto) {
    const { minimum_wage } = await this.legalValuesService.findValues();
    const hourValue = minimum_wage / 240;
    const { employeeId, paymentHistoryId, overtimeTypeId, ...overtimeData } =
      createOvertimeDto;
    const { percentage } = await this.findOneOvertimeType(overtimeTypeId);
    overtimeData.value = overtimeData.hours * hourValue * percentage;

    try {
      const overtime = this.overtimeRepository.create({
        ...overtimeData,
        employee: { id: employeeId },
        paymentHistory: { id: paymentHistoryId },
        overtimeType: { id: overtimeTypeId },
      });
      await this.overtimeRepository.save(overtime);
      return overtime;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async findAll(overtimeFiltersDto: OvertimeFiltersDto) {
    const { category, paymentHistoryId } = overtimeFiltersDto;
    const queryBuilder = this.overtimeRepository
      .createQueryBuilder('overtime')
      .innerJoin('overtime.overtimeType', 'overtimeType');

    if (paymentHistoryId)
      queryBuilder.andWhere('overtime.paymentHistoryId = :paymentHistoryId', {
        paymentHistoryId,
      });
    if (category)
      queryBuilder.andWhere('overtimeType.category = :category', { category });

    return await queryBuilder.getMany();
  }

  async createOvertimeType(createOvertimeTypeDto: CreateOvertimeTypeDto) {
    try {
      const overtimeType = this.overtimeTypeRepository.create(
        createOvertimeTypeDto,
      );
      await this.overtimeTypeRepository.save(overtimeType);
      return overtimeType;
    } catch (error) {
      this.commonService.errorHandler(error);
    }
  }

  async findOneOvertimeType(id: number) {
    const overtimeType = await this.overtimeTypeRepository.findOneBy({ id });
    if (!overtimeType) throw new NotFoundException('Overtime type not found');
    return overtimeType;
  }
}
