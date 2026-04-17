/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Patch,
  Query, // <--- 1. WAJIB TAMBAHKAN INI JIR!
  InternalServerErrorException,
} from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { CreateWilayahDto, UpdateWilayahDto } from './dto/wilayah.dto';

@Controller('wilayah')
export class WilayahController {
  constructor(private readonly wilayahService: WilayahService) {}

  // 2. PINDAHKAN KE ATAS agar tidak tertabrak oleh @Get(':id')
  @Get('check-name')
  async checkName(@Query('nama') nama: string) {
    try {
      if (!nama) return { isDuplicate: false };
      const isDuplicate = await this.wilayahService.checkDuplicateName(nama);
      return { isDuplicate };
    } catch (error) {
      console.error('Error di check-name:', error);
      throw new InternalServerErrorException('Gagal mengecek nama wilayah');
    }
  }

  @Get('tree')
  getWilayahTree() {
    return this.wilayahService.getWilayahTree();
  }

  @Get('provinsi')
  getProvinsi() {
    return this.wilayahService.getProvinsi();
  }

  @Get('provinsi/:id/kota')
  getKotaByProvinsi(@Param('id') id: string) {
    return this.wilayahService.getKotaByProvinsi(+id);
  }

  @Get()
  findAll() {
    return this.wilayahService.findAll();
  }

  // Posisikan @Get(':id') di bawah rute-rute string spesifik
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wilayahService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateWilayahDto) {
    console.log('Data yang masuk ke Backend:', dto);
    return this.wilayahService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWilayahDto) {
    return this.wilayahService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wilayahService.remove(+id);
  }
}
