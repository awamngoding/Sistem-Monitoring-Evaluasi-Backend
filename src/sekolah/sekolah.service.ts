/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // Tambahkan DataSource untuk Transaction
import { CreateSekolahDto } from './dto/create-sekolah.dto';
import { UpdateSekolahDto } from './dto/update-sekolah.dto';
import { Sekolah } from './entities/sekolah.entity';
import { User } from '../users/user.entity'; // Import Entity User
import { Role } from '../roles/role.entity'; // Import Entity Role

@Injectable()
export class SekolahService {
  constructor(
    @InjectRepository(Sekolah)
    private sekolahRepo: Repository<Sekolah>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    private dataSource: DataSource, // Gunakan ini agar jika salah satu gagal, semua dibatalkan
  ) {}

  async create(createSekolahDto: CreateSekolahDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Simpan data ke tabel Sekolah
      const sekolah = queryRunner.manager.create(Sekolah, {
        nama_sekolah: createSekolahDto.nama_sekolah,
        jenjang: createSekolahDto.jenjang,
        npsn: createSekolahDto.npsn,
        akreditasi: createSekolahDto.akreditasi,
        alamat: createSekolahDto.alamat,
        id_wilayah: Number(createSekolahDto.id_wilayah),
        latitude: createSekolahDto.latitude,
        longitude: createSekolahDto.longitude,
        jumlah_guru: createSekolahDto.jumlah_guru || 0,
        jumlah_siswa: createSekolahDto.jumlah_siswa || 0,
      });
      const sekolahSaved = await queryRunner.manager.save(sekolah);

      // 2. Pastikan role "Sekolah" ada, jika tidak buat dulu
      let roleSekolah = await queryRunner.manager.findOne(Role, {
        where: { nama_role: 'Sekolah' },
      });

      if (!roleSekolah) {
        roleSekolah = queryRunner.manager.create(Role, {
          nama_role: 'Sekolah',
          deskripsi: 'Role untuk user sekolah',
        });
        await queryRunner.manager.save(roleSekolah);
      }

      // 3. Simpan kredensial ke tabel Users
      const userBaru = queryRunner.manager.create(User, {
        nama: createSekolahDto.nama_sekolah,
        email: createSekolahDto.email_login,
        password: createSekolahDto.password_login, // Sesuai permintaanmu tanpa bcrypt
        id_sekolah: sekolahSaved.id_sekolah,
        role: roleSekolah,
        status: true,
        jenis: 'Sekolah',
      });
      await queryRunner.manager.save(userBaru);

      await queryRunner.commitTransaction();
      return sekolahSaved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.sekolahRepo.find({
      relations: ['wilayah', 'wilayah.parent'],
      order: { nama_sekolah: 'ASC' },
    });
  }

  async findOne(id: number) {
    const sekolah = await this.sekolahRepo.findOne({
      where: { id_sekolah: id },
      relations: ['wilayah'],
    });
    if (!sekolah) throw new NotFoundException(`Sekolah #${id} tidak ditemukan`);
    return sekolah;
  }

  async update(id: number, updateSekolahDto: UpdateSekolahDto) {
    const sekolah = await this.findOne(id);

    Object.assign(sekolah, {
      ...updateSekolahDto,
      id_wilayah: updateSekolahDto.id_wilayah
        ? Number(updateSekolahDto.id_wilayah)
        : sekolah.id_wilayah,
    });

    return await this.sekolahRepo.save(sekolah);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sekolahRepo.delete(id);
    return { message: `Sekolah #${id} berhasil dihapus` };
  }
}
