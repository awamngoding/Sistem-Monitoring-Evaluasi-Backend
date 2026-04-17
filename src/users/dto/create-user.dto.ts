/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  @IsString()
  nama: string;

  @IsNotEmpty({ message: 'Email wajib diisi' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsNotEmpty({ message: 'Password wajib diisi' })
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsNotEmpty({ message: 'Role wajib dipilih' })
  @IsNumber()
  id_role: number; // Menunjuk ke ID di tabel Roles

  @IsOptional()
  @IsNumber()
  id_sekolah?: number;

  @IsOptional()
  @IsNumber()
  id_wilayah?: number; // Sangat penting untuk mapping AO ke daerahnya

  @IsOptional()
  @IsString()
  jenis?: string; // Bisa diisi 'AO' atau 'HO' sebagai penanda tambahan

  // --- TAMBAHKAN DUA BARIS INI BOS ---
  @IsOptional()
  @IsString()
  sub_jenis?: string; // 👈 Biar data SD/SMP/SMK gak dibuang

  @IsOptional()
  @IsString()
  no_telp?: string; // 👈 Biar Nomor Telepon bisa masuk database
  // ----------------------------------
}
