import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { FiltersDto } from './dto/filters.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user) throw new UnauthorizedException('Not valid credentials');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Not valid credentials');
    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async findAll(filtersDto: FiltersDto) {
    const { limit = 10, page = 1, status, role } = filtersDto;
    const offset = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (status !== undefined) {
      const statusValue = !!status;
      queryBuilder.andWhere('user.status = :statusValue', { statusValue });
    }

    if (role && role.length > 0)
      queryBuilder.andWhere('user.role @> ARRAY[:role]', {
        role,
      });

    const users = await queryBuilder.take(limit).skip(offset).getMany();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
      status: true,
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const { password } = updateUserDto;
    if (password) updateUserDto.password = bcrypt.hashSync(password, 10);

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException('User not found');

    try {
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.userRepository.update(id, { status: false });
    return 'User deleted';
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
