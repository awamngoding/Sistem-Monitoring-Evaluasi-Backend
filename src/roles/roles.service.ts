/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  // CREATE
  async create(data: any) {
    const role = this.roleRepository.create(data);
    return await this.roleRepository.save(role);
  }

  // READ ALL
  async findAll() {
    return await this.roleRepository.find({ order: { id_role: 'ASC' } });
  }

  // READ ONE
  async findOne(id: number) {
    const role = await this.roleRepository.findOne({ where: { id_role: id } });
    if (!role) throw new NotFoundException(`Role dengan ID ${id} tidak ada`);
    return role;
  }

  // UPDATE
  async update(id: number, data: any) {
    await this.findOne(id); // Cek dulu ada gak barangnya
    await this.roleRepository.update(id, data);
    return this.findOne(id);
  }

  // DELETE
  async remove(id: number) {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
    return { message: `Role ${role.nama_role} berhasil dihapus` };
  }
}
