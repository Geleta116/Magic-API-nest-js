import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/middlewares/zod_validation_pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/exception_filter';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  signin(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }
}