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

@Entity()
export class Overtime {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('timestamptz')
  date: Date;

  @ApiProperty()
  @Column({ type: 'int' })
  hours: number;

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
}
