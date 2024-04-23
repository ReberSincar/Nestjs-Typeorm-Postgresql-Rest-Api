import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  ParseIntPipe,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { PageOptionsDto } from 'src/common/pagination/page-meta.dto';

@Controller('users')
@ApiBearerAuth()
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  getUsers(@Query() pageOptions: PageOptionsDto) {
    return this.userService.getUsers(pageOptions);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  getUserByAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Get()
  getUser(@Request() req) {
    return this.userService.getUserById(req.user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
}
