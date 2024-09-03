import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { seedData } from './data/seed-data';
import { EmployeesService } from 'src/employees/employees.service';
import { User } from 'src/auth/entities/user.entity';
import { LegalValuesService } from 'src/legal-values/legal-values.service';
import { OvertimeService } from 'src/overtime/overtime.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: AuthService,
    private readonly employeesService: EmployeesService,
    private readonly legalValuesService: LegalValuesService,
    private readonly overtimeService: OvertimeService,
    private readonly dataSource: DataSource,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertContractTypes();
    await this.insertPaymentFrequencies();
    await this.insertLegalValues();
    await this.insertOvertimeType();
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
    for (const { name } of seedContractTypes) {
      await this.employeesService.createContractType(name);
    }
  }

  private async insertPaymentFrequencies() {
    const seedPaymentFrequencies = seedData.paymentFrequency;
    for (const { name } of seedPaymentFrequencies) {
      await this.employeesService.createPaymentFrequency(name);
    }
  }

  private async insertLegalValues() {
    const seedLegalValues = seedData.legalValue;
    const promises = [];
    seedLegalValues.forEach((legalValue) => {
      promises.push(this.legalValuesService.create(legalValue));
    });
    await Promise.all(promises);
  }

  private async insertOvertimeType() {
    const seedOvertimeType = seedData.overtimeType;
    for (const overtimeType of seedOvertimeType) {
      await this.overtimeService.createOvertimeType(overtimeType);
    }
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
