import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { buildSearchQuery } from 'src/common/helpers/build-search-query';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

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

    const total = users.length;
    const pages = Math.ceil(total / limit) || 1;

    return {
      users,
      total,
      page,
      pages,
      limit,
    };
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
