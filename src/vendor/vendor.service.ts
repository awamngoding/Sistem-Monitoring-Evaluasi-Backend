/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { UsersService } from '../users/users.service'; // 👈 Import ini buat bikin akun login

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,

    private usersService: UsersService, // 👈 Inject ini di constructor
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    try {
      // 1. Buat Akun User dulu di m_users supaya PJ bisa login
      const userBaru = await this.usersService.create({
        nama: createVendorDto.pj_1,
        email: createVendorDto.email,
        password: createVendorDto.password,
        jabatan: 'Vendor Partner',
        id_role: 6, // 👈 Pastikan ID 6 adalah role VENDOR di database kamu
        status: true,
      });

      // 2. Simpan detail Vendor ke m_vendor dan hubungkan ke id_user tadi
      const vendorBaru = this.vendorRepo.create({
        nama_vendor: createVendorDto.nama_vendor,
        no_register: createVendorDto.no_register,
        pj_1: createVendorDto.pj_1,
        telp_pj_1: createVendorDto.telp_pj_1,
        pj_2: createVendorDto.pj_2,
        telp_pj_2: createVendorDto.telp_pj_2,
        pilar: createVendorDto.pilar,
        alamat: createVendorDto.alamat,
        status: 'Bermitra',
        user: userBaru, // 👈 Relasikan ke user yang baru dibuat
        npwp_file: createVendorDto.npwp_file,
        ktp_pj_file: createVendorDto.ktp_pj_file,
      });

      return await this.vendorRepo.save(vendorBaru);
    } catch (error) {
      console.error('ERROR_CREATE_VENDOR:', error.message);
      throw new InternalServerErrorException(
        'Gagal mendaftarkan vendor dan akun login.',
      );
    }
  }

  async findAll() {
    return await this.vendorRepo.find({
      relations: ['user'], // 👈 Biar ketahuan akun loginnya siapa
      order: { nama_vendor: 'ASC' },
    });
  }

  async findOne(id: number) {
    const vendor = await this.vendorRepo.findOne({
      where: { id_vendor: id },
      relations: ['user'],
    });
    if (!vendor)
      throw new NotFoundException(`Vendor dengan ID ${id} tidak ditemukan`);
    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.findOne(id);

    // Update data vendor (pj, pilar, dll)
    Object.assign(vendor, updateVendorDto);

    return await this.vendorRepo.save(vendor);
  }

  async remove(id: number) {
    const vendor = await this.findOne(id);

    // Hapus vendor (User akan ikut terhapus jika di Entity pakai onDelete: 'CASCADE')
    await this.vendorRepo.delete(id);

    return { message: `Vendor ${vendor.nama_vendor} berhasil dihapus` };
  }
}
