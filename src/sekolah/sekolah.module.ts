/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sekolah } from './entities/sekolah.entity';
import { SekolahService } from './sekolah.service';
import { SekolahController } from './sekolah.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sekolah])],
  controllers: [SekolahController],
  providers: [SekolahService],
})
export class SekolahModule {}
