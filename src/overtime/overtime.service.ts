import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OvertimeType } from './entities/overtime-type.entity';
import { Repository } from 'typeorm';
import { Overtime } from './entities/overtime.entity';
import { CreateOvertimeTypeDto } from './dto/create-overtime-type.dto';
import { LegalValuesService } from 'src/legal-values/legal-values.service';

@Injectable()
export class OvertimeService {
  private readonly logger = new Logger('OvertimeService');
  constructor(
    @InjectRepository(Overtime)
    private readonly overtimeRepository: Repository<Overtime>,

    @InjectRepository(OvertimeType)
    private readonly overtimeTypeRepository: Repository<OvertimeType>,

    private readonly legalValuesService: LegalValuesService,
  ) {}
  async create(createOvertimeDto: CreateOvertimeDto) {
    const { minimum_wage } = await this.legalValuesService.findValues();
    const hourValue = minimum_wage / 240;
    const { employeeId, paymentHistoryId, overtimeTypeId, ...overtimeData } =
      createOvertimeDto;
    // TODO: include overtime type percentage
    overtimeData.value = overtimeData.hours * hourValue;
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
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return `This action returns all overtime`;
  }

  findOne(id: number) {
    return `This action returns a #${id} overtime`;
  }

  update(id: number, updateOvertimeDto: UpdateOvertimeDto) {
    return `This action updates a #${id} overtime`;
  }

  remove(id: number) {
    return `This action removes a #${id} overtime`;
  }

  async createOvertimeType(createOvertimeTypeDto: CreateOvertimeTypeDto) {
    try {
      const overtimeType = this.overtimeTypeRepository.create(
        createOvertimeTypeDto,
      );
      await this.overtimeTypeRepository.save(overtimeType);
      return overtimeType;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
