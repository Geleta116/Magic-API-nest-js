import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, }), UserModule, TaskModule, AuthModule, JwtModule.register({
    global: true,
    secret: process.env.secret,
    signOptions: { expiresIn: '1200s' },
  })],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
