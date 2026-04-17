/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { UsersModule } from '../users/users.module'; // 👈 1. Import Module-nya

@Module({
  // Tambahkan UsersModule di sini agar VendorService bisa pakai UsersService
  imports: [
    TypeOrmModule.forFeature([Vendor]),
    UsersModule, // 👈 2. Daftarkan di sini
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
