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
  @Column('date')
  date: Date;

  @Column({ type: 'float' })
  base_salary: number;

  @Column({ type: 'float' })
  night_surcharge: number;

  @Column({ type: 'float' })
  holiday_night_surcharge: number;

  @Column({ type: 'float' })
  holiday_daytime_surcharge: number;

  @Column({ type: 'float' })
  night_overtime: number;

  @Column({ type: 'float' })
  daytime_overtime: number;

  @Column({ type: 'float' })
  holiday_night_overtime: number;

  @Column({ type: 'float' })
  holiday_daytime_overtime: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne(() => Employee, (employee) => employee.paymentHistory)
  employee: Employee;
}
