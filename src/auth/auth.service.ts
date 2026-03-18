/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = {
      sub: user.id_user,
      email: user.email,
      role: user.role.nama_role,
      id_sekolah: user.id_sekolah,
      nama: user.nama,
      jenis: user.jenis,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
