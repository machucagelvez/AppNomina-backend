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
import { OvertimeType } from './overtime-type.entity';
import { PaymentHistory } from 'src/payment-history/entities/payment-history.entity';

@Entity()
export class Overtime {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  date: string;

  @ApiProperty()
  @Column({ type: 'int' })
  hours: number;

  @ApiProperty()
  @Column({ type: 'float' })
  value: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne(() => Employee, (employee) => employee.overtime)
  employee: Employee;

  @ApiProperty()
  @ManyToOne(() => OvertimeType, (overtimeType) => overtimeType.overtime)
  overtimeType: OvertimeType;

  @ApiProperty()
  @ManyToOne(() => PaymentHistory, (paymentHistory) => paymentHistory.overtime)
  paymentHistory: PaymentHistory;
}
