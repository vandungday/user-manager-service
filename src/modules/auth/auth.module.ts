import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guard/jwt.guard';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
