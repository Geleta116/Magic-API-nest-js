import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/middlewares/zod_validation_pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  signin(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

 
 

}
