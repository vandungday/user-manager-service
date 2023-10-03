import { User } from 'src/modules/user/entities/user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;
