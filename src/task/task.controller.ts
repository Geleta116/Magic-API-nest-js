import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, UsePipes, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskSchema } from './dto/update-task.dto';
import { AuthGuard } from 'src/common/guards/auth_guard';
import { ZodValidationPipe } from 'src/common/middlewares/zod_validation_pipe';

@Controller('todos')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  async create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    const user = request['user'];
    const creator_id = user.sub;
    return this.taskService.create(creator_id, createTaskDto);
  }

  @Get()
  async findAll(@Req() request: Request) {
    const user = request['user'];
    const user_id = user.sub;
    return this.taskService.findAll(user_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateTaskSchema))
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: Request) {
    const user = request['user'];
    const user_id = user.sub;
    const user_roles = user.roles
    return this.taskService.remove(+id, user_roles, user_id);
  }
}
