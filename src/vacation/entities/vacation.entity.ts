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
export class Vacation {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  start_date: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  end_date: string;

  @ApiProperty()
  @Column({ type: 'bool', default: true })
  last_taken: boolean;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne(() => Employee, (employee) => employee.vacation, { eager: true })
  employee: Employee;
}
