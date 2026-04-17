/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
// Hapus import bcrypt karena sudah tidak dipakai
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, passwordInput: string) {
    const user = await this.usersService.findByEmail(email);

    console.log('User ditemukan:', user);

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    console.log('DB Pass:', user.password, '| Input Pass:', passwordInput);

    // BANDINGKAN STRING LANGSUNG (Plain Text)
    // Sesuai dengan data di users.service yang tidak di-hash lagi
    if (user.password !== passwordInput) {
      throw new UnauthorizedException('Password salah');
    }

    // PAYLOAD ini yang bakal dibaca sama Sidebar.jsx kamu di Frontend
    const payload = {
      sub: user.id_user,
      email: user.email,
      role: user?.role?.nama_role || 'No Role', // Misal: "Admin" atau "HO"
      id_sekolah: user.id_sekolah,
      nama: user.nama,
      jenis: user.jenis, // Penting buat filter menu Akademik/Non-Akademik
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
