import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LegalValuesService } from './legal-values.service';
import { CreateLegalValueDto } from './dto/create-legal-value.dto';
import { UpdateLegalValueDto } from './dto/update-legal-value.dto';

@Controller('legal-values')
export class LegalValuesController {
  constructor(private readonly legalValuesService: LegalValuesService) {}

  @Post()
  create(@Body() createLegalValueDto: CreateLegalValueDto) {
    return this.legalValuesService.create(createLegalValueDto);
  }

  @Get()
  findAll() {
    return this.legalValuesService.findAll();
  }

  @Get(':id')
  findValues() {
    return this.legalValuesService.findValues();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLegalValueDto: UpdateLegalValueDto,
  ) {
    return this.legalValuesService.update(+id, updateLegalValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legalValuesService.remove(+id);
  }
}
