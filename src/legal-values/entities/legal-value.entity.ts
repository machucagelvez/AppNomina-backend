import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  transport_subsidy: number;

  @ApiProperty()
  @Column({ type: 'float' })
  severance_pay_interest: number;

  @ApiProperty()
  @Column({ type: 'float' })
  night_surcharge_percentage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  holiday_night_surcharge_percentage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  holiday_daytime_surcharge_percentage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  night_overtime_percentage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  daytime_overtime_percentage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  holiday_night_overtime_percentage: number;

  @ApiProperty()
  @Column({ type: 'float' })
  holiday_daytime_overtime_percentage: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
