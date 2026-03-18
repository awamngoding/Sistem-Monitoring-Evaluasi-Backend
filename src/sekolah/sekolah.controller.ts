/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { SekolahService } from './sekolah.service';

@Controller('sekolah')
export class SekolahController {
  constructor(private readonly sekolahService: SekolahService) {}

  @Get()
  findAll() {
    return this.sekolahService.findAll();
  }
}
