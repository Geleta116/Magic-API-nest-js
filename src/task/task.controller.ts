import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskSchema } from './dto/update-task.dto';
import { AuthGuard } from 'src/common/guards/auth_guard';
import { ZodValidationPipe } from 'src/common/middlewares/zod_validation_pipe';

@Controller('todos')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  async create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    const user = request['user']; 
    const creator_id = user.id;
    return this.taskService.create(creator_id, createTaskDto);
  }

  @Get()
  async findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateTaskSchema))
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
