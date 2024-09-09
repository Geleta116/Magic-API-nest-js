import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from 'src/common/middlewares/zod_validation_pipe';
import { createUserSchema } from '../auth/dto/create-user.dto';
import { AuthGuard } from 'src/common/guards/auth_guard';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles_guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch(':id')
  updatePassword(@Param('id') id: string, @Body() password: string) {
    return this.userService.updatePassword(+id, password);
  }
  
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
