/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- 1. ROUTE KHUSUS (STATIC ROUTES) ---
  // Taruh di atas agar tidak tertabrak rute /:id

  @Get('ho')
  getHoUsers() {
    return this.usersService.getUsersByRole('HO');
  }

  @Get('ao')
  getAoUsers() {
    return this.usersService.getUsersByRole('AO');
  }

  @Get('pengurus')
  getPengurusUsers() {
    return this.usersService.getUsersByRole('PENGURUS');
  }

  // --- 2. REGISTRATION ROUTES ---

  @Post('register')
  register(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Post('register_ao')
  registerAO(@Body() body: any) {
    // Kita arahkan ke fungsi create yang sama di service
    return this.usersService.create({ ...body, role: 'AO' });
  }

  // --- 3. GENERAL CRUD ROUTES ---

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id') // Menggunakan Patch lebih baik daripada Put untuk update user
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
