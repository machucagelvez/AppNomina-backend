import { ApiProperty } from '@nestjs/swagger';
import { Employee } from 'src/employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PaymentHistory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('timestamptz')
  date: Date;

  @ApiProperty()
  @Column({ type: 'float' })
  base_salary: number;

  @ApiProperty()
  @Column({ type: 'float' })
  night_surcharge: number;

  @ApiProperty()
  @Column({ type: 'float' })
  holiday_night_surcharge: number;

  @ApiProperty()
  @Column({ type: 'float' })
  holiday_daytime_surcharge: number;

  @ApiProperty()
  @Column({ type: 'float' })
  night_overtime: number;

  @ApiProperty()
  @Column({ type: 'float' })
  daytime_overtime: number;

  @ApiProperty()
  @Column({ type: 'float' })
  holiday_night_overtime: number;

  @ApiProperty()
  @Column({ type: 'float' })
  holiday_daytime_overtime: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne(() => Employee, (employee) => employee.paymentHistory)
  employee: Employee;
}
