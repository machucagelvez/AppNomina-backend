import { PartialType } from '@nestjs/swagger';
import { CreateLegalValueDto } from './create-legal-value.dto';

export class UpdateLegalValueDto extends PartialType(CreateLegalValueDto) {}
