import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from 'src/common/middlewares/zod_validation_pipe';
import { createUserSchema } from '../auth/dto/create-user.dto';
import { AuthGuard } from 'src/common/guards/auth_guard';
import { UpdateUserDto, UpdateUserPasswordDto, UpdateUserPasswordSchema, UpdateUserSchema } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles_guard';
import { Role, Roles } from 'src/common/decorators/roles.decorator';
import { request } from 'http';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Put('/updatepassword/:id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(UpdateUserPasswordSchema))
  updateUsersPassword(@Param('id') id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return this.userService.updateUsersPassword(+id, updateUserPasswordDto.password!);
  }

  @Put('password')
  @UsePipes(new ZodValidationPipe(UpdateUserPasswordSchema))
  updateYourPassword(@Body() updateUserPasswordDto: UpdateUserPasswordDto, @Req() request: Request) {
    const user = request['user'];
    const loggedinUserid = user.sub;
    return this.userService.updateYourPassword(+loggedinUserid, updateUserPasswordDto.password!);
  }
  
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
