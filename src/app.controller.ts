/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Controller('users')
export class AppController {
  // Pastikan namanya AppController atau UsersController sesuai file
  constructor(private readonly usersService: UsersService) {}

  @Get('ho')
  getHoUsers() {
    // Panggil fungsi baru yang ada di service
    return this.usersService.getUsersByRole('HO');
  }
}
