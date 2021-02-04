import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { toUserDto } from 'src/shared/mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const { registrationDate, lastActivityDate } = createUserDto;
    const user: User = await this.usersRepository.create({ lastActivityDate, registrationDate });
    await this.usersRepository.save(user);
    return toUserDto(user);
  }

  getRollingRetention() {
    return this.usersRepository
      .createQueryBuilder('user')
      .select(
        '(SELECT COUNT(*) FROM `user` WHERE DATEDIFF(lastActivityDate, registrationDate) > 7) / (SELECT COUNT(*) FROM `user` WHERE DATEDIFF(NOW(), registrationDate) > 7)',
        'rollingRetention',
      )
      .getRawOne()
      .then((data) => {
        data.rollingRetention = Number(data.rollingRetention);
        return data;
      });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
