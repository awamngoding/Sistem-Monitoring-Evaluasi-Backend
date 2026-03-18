/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('ho')
  getHoUsers() {
    return this.usersService.getHoUsers();
  }
}
