import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { PasswordUtils } from 'src/common/utils/password.utils';
import { notAcceptable, notFound } from 'src/common/errors';
import { DataSource, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/pagination/page-meta.dto';

@Injectable()
export class UserService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUsers(pageOptions: PageOptionsDto) {
    const userResult = await await User.findAndCount({
      skip: pageOptions.skip,
      take: pageOptions.take,
      order: {
        ['createdAt']: pageOptions.order,
      },
    });

    const meta = new PageMetaDto({
      itemCount: userResult[1],
      pageOptionsDto: pageOptions,
    });
    return new PageDto(userResult[0], meta);
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await User.findOneBy({ id });
    if (!user) notFound('User not found');
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return User.findOneBy({ email });
  }

  async checkEmailPhone(
    email: string,
    phone: string,
    em?: EntityManager,
  ): Promise<User | null> {
    em = em ?? this.dataSource.createEntityManager();
    return em.findOne(User, {
      where: [{ email }, { phone }],
    });
  }

  async createUser(
    createUserDto: CreateUserDto,
    em?: EntityManager,
  ): Promise<User | null> {
    em = em ?? this.dataSource.createEntityManager();
    const checkEmailPhone = await this.checkEmailPhone(
      createUserDto.email,
      createUserDto.phone,
      em,
    );
    if (checkEmailPhone) notAcceptable('Email or phone already using');

    const password = await PasswordUtils.createHashedPassword(
      createUserDto.password,
    );
    return em.save(User, { ...createUserDto, password });
  }

  async removeUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    if (user.role === Role.ADMIN) notAcceptable('Admins can not be delete');
    await user.softRemove();
  }

  async createAdminUser() {
    const admin = await User.findOne({
      where: {
        role: Role.ADMIN,
        email: process.env.ADMIN_EMAIL,
      },
    });

    if (admin) return;

    const entity = new User();
    entity.role = Role.ADMIN;
    entity.firstName = 'ADMIN';
    entity.lastName = 'ADMIN';
    entity.email = process.env.ADMIN_EMAIL.toLocaleLowerCase();
    entity.phone = process.env.ADMIN_PHONE;
    entity.password = PasswordUtils.createHashedPassword(
      process.env.ADMIN_PASSWORD,
    );

    await entity.save();
  }
}
