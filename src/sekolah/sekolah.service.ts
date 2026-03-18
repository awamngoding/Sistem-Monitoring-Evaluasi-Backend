/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sekolah } from './entities/sekolah.entity';

@Injectable()
export class SekolahService {
  constructor(
    @InjectRepository(Sekolah)
    private sekolahRepo: Repository<Sekolah>,
  ) {}

  findAll() {
    return this.sekolahRepo.find({ where: { status: true } });
  }
}
