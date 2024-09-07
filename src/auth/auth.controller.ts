import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/middlewares/zod_validation_pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/exception_filter';

@Controller('auth')
// @UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
