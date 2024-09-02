import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LegalValue {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'float' })
  pension_percentage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  health_insurance_percentage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  transportation_assistance: number;

  @ApiProperty()
  @Column({ type: 'float' })
  minimum_wage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  severance_pay_interest: number;
}
