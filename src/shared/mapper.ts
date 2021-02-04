import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const toUserDto = (data: User): CreateUserDto => {
  const { id, registrationDate, lastActivityDate } = data;
  return { id, registrationDate, lastActivityDate }
};
