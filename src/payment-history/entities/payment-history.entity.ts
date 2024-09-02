import { ApiProperty } from '@nestjs/swagger';
import { Employee } from 'src/employees/entities/employee.entity';
import { Overtime } from 'src/overtime/entities/overtime.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PaymentHistory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  start_period: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  end_period: string;

  @ApiProperty()
  @Column({ type: 'float' })
  period_salary: number;

  @ApiProperty()
  @Column({ type: 'float' })
  pension_discount: number;

  @ApiProperty()
  @Column({ type: 'float' })
  health_insurance_discount: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  transportation_assistance: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  night_surcharge: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  holiday_night_surcharge: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  holiday_daytime_surcharge: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  night_overtime: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  daytime_overtime: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  holiday_night_overtime: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  holiday_daytime_overtime: number;

  @ApiProperty()
  @ManyToOne(() => Employee, (employee) => employee.paymentHistory)
  employee: Employee;

  @ApiProperty()
  @OneToMany(() => Overtime, (overtime) => overtime.paymentHistory)
  overtime: Overtime;
}
