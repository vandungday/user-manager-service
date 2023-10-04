import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { buildSearchQuery } from 'src/common/helpers/build-search-query';
import { exclude } from 'src/common/helpers/exclude';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findAll(search?: any) {
    const {
      query,
      options: { page, limit, skip },
    } = buildSearchQuery(search);

    const [users] = await this.userRepository.findAndCount({
      where: query,
      take: limit,
      skip,
    });

    const usersWithoutPassword = users.map((user) => {
      return exclude<User, 'password'>(user, ['password']);
    });

    const total = users.length;
    const pages = Math.ceil(total / limit) || 1;

    return {
      users: usersWithoutPassword,
      total,
      page,
      pages,
      limit,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return exclude<User, 'password'>(user, ['password']);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
