import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/common/guards/auth_guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})
export class AuthModule { }
