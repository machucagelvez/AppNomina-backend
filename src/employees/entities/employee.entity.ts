import { User } from 'src/auth/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  first_name: string;

  @Column({ type: 'varchar', length: 64 })
  last_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  document: string;

  @Column('text')
  eps: string;

  @Column('text')
  afp: string;

  @Column('text')
  ccf: string;

  @Column('numeric')
  salary: number;

  @Column('date')
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @Column({ type: 'text', nullable: true })
  photo: string;

  @ManyToOne(() => User, (user) => user.employee)
  user: User;

  @BeforeInsert()
  parseDate() {
    this.start_date = new Date(this.start_date);
  }
}
