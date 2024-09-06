import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CommonService {
  private readonly logger = new Logger('CommonService');

  errorHandler(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.status) throw error;

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
