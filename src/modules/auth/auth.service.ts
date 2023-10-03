import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { SignTokenPayload } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UserWithoutPassword } from '@/common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { exclude } from '@/common/helpers/exclude';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    const isExisted = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (isExisted) {
      throw new BadRequestException('Email is already existed');
    }
    const saltOrRounds = 7;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    const newUser = await this.userRepository.save({
      email,
      password: hashPassword,
    });

    const userId = newUser.id;
    const payload = { userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload),
      this.generateToken(payload, true),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Email or password is not correct');
    }

    const userId = user.id;
    const payload = { userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload),
      this.generateToken(payload, true),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateToken(
    payload: SignTokenPayload,
    isRefreshToken = false,
  ): Promise<string> {
    const secret = this.configService.get<string>('jwt.secret');
    const expiresIn = this.configService.get<string>('jwt.expiresIn');
    const secretRefresh = this.configService.get<string>('jwt.secretRefresh');
    const expiresInRefresh = this.configService.get<string>(
      'jwt.expiresInRefresh',
    );

    const options = {
      secret: isRefreshToken ? secretRefresh : secret,
      expiresIn: isRefreshToken ? expiresInRefresh : expiresIn,
    };

    return this.jwtService.signAsync(payload, options);
  }

  getMe(user: User): UserWithoutPassword {
    return exclude<User, 'password'>(user, ['password']);
  }
}
