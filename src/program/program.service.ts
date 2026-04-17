/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  // SEKARANG: Menerima 3 argumen sesuai kiriman Controller
  async create(
    createProgramDto: CreateProgramDto,
    file: Express.Multer.File,
    id_user: number,
  ) {
    try {
      // Kita buat instance berdasarkan kolom yang ada di Entity kamu
      const newProgram = this.programRepo.create({
        nama_program: createProgramDto.nama_program,
        deskripsi: createProgramDto.deskripsi,
        kategori: createProgramDto.kategori,
        tahun: createProgramDto.tahun ? Number(createProgramDto.tahun) : null,
        tanggal_mulai: createProgramDto.tanggal_mulai,
        tanggal_selesai: createProgramDto.tanggal_selesai,
        status_program: createProgramDto.status_program || 'Draft',
        id_sekolah: Number(createProgramDto.id_sekolah),
        id_vendor: createProgramDto.id_vendor
          ? Number(createProgramDto.id_vendor)
          : null,
        id_pengawas: createProgramDto.id_pengawas
          ? Number(createProgramDto.id_pengawas)
          : null,
        dibuat_oleh: id_user,
        file_mou: file ? file.filename : null,
      } as any);

      return await this.programRepo.save(newProgram);
    } catch (error) {
      console.error('🔥 Error saat save program:', error);
      throw new InternalServerErrorException(
        'Gagal menyimpan program ke database!',
      );
    }
  }

  // SEKARANG: Menerima parameter kategori dari Controller
  async findAll(kategori?: string) {
    // Karena di Entity kamu tidak pakai @ManyToOne,
    // kamu tidak bisa pakai 'relations'. Tarik data plain saja.
    const whereCondition = kategori ? { kategori } : {};
    return await this.programRepo.find({
      where: whereCondition,
    });
  }

  async findOne(id: number) {
    return await this.programRepo.findOne({
      where: { id_program: id },
    });
  }

  // SEKARANG: Menerima 4 argumen sesuai kiriman Controller
  async update(
    id: number,
    updateData: any,
    file: Express.Multer.File,
    id_user: number,
  ) {
    try {
      const dataToSave = { ...updateData };
      if (file) {
        dataToSave.file_mou = file.filename;
      }

      await this.programRepo.update(id, dataToSave);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Gagal update program');
    }
  }

  remove(id: number) {
    return this.programRepo.delete(id);
  }
}
