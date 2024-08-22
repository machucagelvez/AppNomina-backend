import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { seedData } from './data/seed-data';
import { EmployeesService } from 'src/employees/employees.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: AuthService,
    private readonly employeesService: EmployeesService,
    private readonly dataSource: DataSource,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertContractTypes();
    await this.insertPaymentFrequencies();
    await this.insertEmployees(user);
    return 'Seed executed';
  }

  private async insertUsers() {
    const seedUsers = seedData.users;
    const promises = [];
    seedUsers.forEach((user) => {
      promises.push(this.userService.create(user));
    });
    const users = await Promise.all(promises);

    return users[0];
  }

  private async insertContractTypes() {
    const seedContractTypes = seedData.contract;
    const promises = [];
    seedContractTypes.forEach(({ name }) => {
      promises.push(this.employeesService.createContractType(name));
    });
    await Promise.all(promises);
  }

  private async insertPaymentFrequencies() {
    const seedPaymentFrequencies = seedData.paymentFrequency;
    const promises = [];
    seedPaymentFrequencies.forEach(({ name }) => {
      promises.push(this.employeesService.createPaymentFrequency(name));
    });
    await Promise.all(promises);
  }

  private async insertEmployees(user: User) {
    const seedPEmployees = seedData.employees;
    const promises = [];
    seedPEmployees.forEach((employee) => {
      promises.push(this.employeesService.create(employee, user));
    });
    await Promise.all(promises);
  }

  private async deleteTables(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query('SET session_replication_role = replica;');

      const tables = await queryRunner.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE';
      `);

      for (const table of tables) {
        await queryRunner.query(
          `TRUNCATE TABLE "${table.table_name}" RESTART IDENTITY CASCADE;`,
        );
      }

      await queryRunner.query('SET session_replication_role = DEFAULT;');
    } catch (error) {
      await queryRunner.query('SET session_replication_role = DEFAULT;');
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
