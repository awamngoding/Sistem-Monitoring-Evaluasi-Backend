/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SekolahService } from './sekolah.service';
import { SekolahController } from './sekolah.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sekolah } from './entities/sekolah.entity';
import { User } from '../users/user.entity'; // <--- 1. Tambahkan import ini
import { Role } from '../roles/role.entity'; // <--- Tambahkan import Role
import { RolesModule } from '../roles/roles.module'; // <--- Tambahkan import RolesModule

@Module({
  // 2. Tambahkan User ke dalam array forFeature
  imports: [TypeOrmModule.forFeature([Sekolah, User, Role]), RolesModule],
  controllers: [SekolahController],
  providers: [SekolahService],
})
export class SekolahModule {}
