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

@Injectable()
export class OvertimeService {
  private readonly logger = new Logger('OvertimeService');
  constructor(
    @InjectRepository(OvertimeType)
    private readonly overtimeTypeRepository: Repository<OvertimeType>,
  ) {}
  create(createOvertimeDto: CreateOvertimeDto) {
    return 'This action adds a new overtime';
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

  async createOvertimeType(name: string) {
    try {
      const overtimeType = this.overtimeTypeRepository.create({ name });
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
