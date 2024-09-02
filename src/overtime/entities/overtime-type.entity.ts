import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Overtime } from './overtime.entity';

@Entity()
export class OvertimeType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 64 })
  name: string;

  @ApiProperty()
  @Column('float')
  percentage: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 10 })
  category: string;

  @OneToMany(() => Overtime, (overtime) => overtime.overtimeType)
  overtime: Overtime;
}
