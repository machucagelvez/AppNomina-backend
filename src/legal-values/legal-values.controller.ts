import { Controller, Get, Post, Body } from '@nestjs/common';
import { LegalValuesService } from './legal-values.service';
import { CreateLegalValueDto } from './dto/create-legal-value.dto';

@Controller('legal-values')
export class LegalValuesController {
  constructor(private readonly legalValuesService: LegalValuesService) {}

  @Post()
  create(@Body() createLegalValueDto: CreateLegalValueDto) {
    return this.legalValuesService.create(createLegalValueDto);
  }

  @Get(':id')
  findValues() {
    return this.legalValuesService.findValues();
  }
}
