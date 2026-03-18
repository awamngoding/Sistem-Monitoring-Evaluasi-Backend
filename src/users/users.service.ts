/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find({ relations: ['role'] });
  }

  findOne(id: number) {
    return this.userRepo.findOne({
      where: { id_user: id },
      relations: ['role'],
    });
  }

  async create(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      nama: data.nama,
      email: data.email,
      password: hashed,
      role: { id_role: data.id_role }, // ini penting
    });

    return this.userRepo.save(user);
  }

  async update(id: number, data: any) {
    await this.userRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });
  }
  async getHoUsers() {
    return this.userRepo.find({
      where: {
        role: {
          nama_role: 'HO',
        },
      },
      select: ['id_user', 'nama'],
      relations: ['role'],
    });
  }

  async register(data: {
    nama: string;
    email: string;
    password: string;
    id_sekolah: number;
  }) {
    const existing = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (existing) throw new Error('Email sudah terdaftar');

    const hashed = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      nama: data.nama,
      email: data.email,
      password: hashed,
      role: { id_role: 3 }, // id_role 3 = Guru
      id_sekolah: data.id_sekolah,
    });

    return this.userRepo.save(user);
  }
}
