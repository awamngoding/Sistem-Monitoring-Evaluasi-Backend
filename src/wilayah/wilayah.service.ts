/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wilayah } from './entities/wilayah.entity';
import { CreateWilayahDto, UpdateWilayahDto } from './dto/wilayah.dto';

@Injectable()
export class WilayahService {
  constructor(
    @InjectRepository(Wilayah)
    private wilayahRepository: Repository<Wilayah>,
  ) {}

  // 1. GET kota/kabupaten berdasarkan id provinsi
  async getKotaByProvinsi(id_provinsi: number): Promise<Wilayah[]> {
    return this.wilayahRepository.find({
      where: { id_parent: id_provinsi, status: true },
      relations: ['user'],
      order: { nama_wilayah: 'ASC' },
    });
  }

  // 2. GET semua wilayah untuk dropdown/tree
  async getWilayahTree(): Promise<any> {
    const provinsi = await this.wilayahRepository.find({
      where: { jenis_wilayah: 'PROVINSI', status: true },
      relations: ['children', 'children.user', 'children.sekolah'], // 👈 Tambah relasi sekolah
      order: { nama_wilayah: 'ASC' },
    });

    return provinsi.map((prov) => ({
      id: prov.id_wilayah,
      nama: prov.nama_wilayah,
      kota: prov.children
        .filter((k) => k.status)
        .map((k) => ({
          id: k.id_wilayah,
          nama: k.nama_wilayah,
          ao_name: k.user?.nama || 'Belum Ada AO',
          tahun_awal_binaan: k.tahun_awal_binaan,
          // Agregasi jumlah sekolah di tree jika diperlukan
          jumlah_sd: k.sekolah?.filter((s) => s.jenjang === 'SD').length || 0,
          jumlah_smp: k.sekolah?.filter((s) => s.jenjang === 'SMP').length || 0,
          jumlah_smk: k.sekolah?.filter((s) => s.jenjang === 'SMK').length || 0,
        })),
    }));
  }

  // 3. FIND ALL
  async findAll(): Promise<Wilayah[]> {
    return this.wilayahRepository.find({
      relations: ['parent', 'user', 'sekolah'], // 👈 Tambahkan sekolah
    });
  }

  // 4. FIND ONE (CORE LOGIC UNTUK HALAMAN DETAIL)
  async findOne(id: number): Promise<Wilayah> {
    const wilayah = await this.wilayahRepository.findOne({
      where: { id_wilayah: id },
      relations: ['parent', 'children', 'user', 'sekolah'], // 👈 WAJIB ADA 'sekolah'
    });

    console.log('DATA SEKOLAH DITEMUKAN:', wilayah?.sekolah?.length);
    console.log(
      'LIST JENJANG:',
      wilayah?.sekolah?.map((s) => s.jenjang),
    );

    if (!wilayah) throw new NotFoundException(`Wilayah #${id} tidak ditemukan`);

    // ✨ LOGIC AGREGASI REAL-TIME ✨
    // Menghitung statistik berdasarkan data sekolah yang terhubung
    if (wilayah.sekolah && wilayah.sekolah.length > 0) {
      wilayah.jumlah_sd = wilayah.sekolah.filter(
        (s) => s.jenjang === 'SD',
      ).length;
      wilayah.jumlah_smp = wilayah.sekolah.filter(
        (s) => s.jenjang === 'SMP',
      ).length;
      wilayah.jumlah_smk = wilayah.sekolah.filter(
        (s) => s.jenjang === 'SMK',
      ).length;

      // Akumulasi Guru dan Siswa dari seluruh sekolah di wilayah tersebut
      wilayah.jumlah_guru = wilayah.sekolah.reduce(
        (acc, curr) => acc + (Number(curr.jumlah_guru) || 0),
        0,
      );
      wilayah.jumlah_siswa = wilayah.sekolah.reduce(
        (acc, curr) => acc + (Number(curr.jumlah_siswa) || 0),
        0,
      );
    } else {
      // Jika belum ada sekolah, pastikan angka default adalah 0
      wilayah.jumlah_sd = 0;
      wilayah.jumlah_smp = 0;
      wilayah.jumlah_smk = 0;
      wilayah.jumlah_guru = 0;
      wilayah.jumlah_siswa = 0;
    }

    return wilayah;
  }

  // 5. GET PROVINSI
  async getProvinsi(): Promise<Wilayah[]> {
    return this.wilayahRepository.find({
      where: { jenis_wilayah: 'PROVINSI', status: true },
      order: { nama_wilayah: 'ASC' },
    });
  }

  // 6. CREATE
  async create(dto: CreateWilayahDto): Promise<Wilayah> {
    const wilayah = this.wilayahRepository.create(dto);
    return this.wilayahRepository.save(wilayah);
  }

  // 7. UPDATE
  async update(id: number, dto: UpdateWilayahDto): Promise<Wilayah> {
    const wilayah = await this.wilayahRepository.preload({
      id_wilayah: id,
      ...dto,
    });
    if (!wilayah) throw new NotFoundException(`Wilayah #${id} tidak ditemukan`);
    return this.wilayahRepository.save(wilayah);
  }

  // 8. REMOVE
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.wilayahRepository.update({ id_wilayah: id }, { status: false });
  }

  // 9. CHECK DUPLICATE
  async checkDuplicateName(nama: string): Promise<boolean> {
    const decodedName = decodeURIComponent(nama).trim();
    const count = await this.wilayahRepository.count({
      where: { nama_wilayah: decodedName },
    });
    return count > 0;
  }
}
