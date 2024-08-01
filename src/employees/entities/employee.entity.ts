import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 64 })
  first_name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 64 })
  last_name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 64, unique: true })
  document: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 8 })
  document_type: string;

  @ApiProperty()
  @Column('text')
  eps: string;

  @ApiProperty()
  @Column('text')
  afp: string;

  @ApiProperty()
  @Column('text')
  ccf: string;

  @ApiProperty()
  @Column('numeric')
  salary: number;

  @ApiProperty()
  @Column('date')
  start_date: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @ApiProperty()
  @Column({ type: 'bool', default: true })
  status: boolean;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  photo: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.employee, { eager: true })
  user: User;

  @BeforeInsert()
  parseDate() {
    this.start_date = new Date(this.start_date);
  }
}
