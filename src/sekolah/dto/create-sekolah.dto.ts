/* eslint-disable prettier/prettier */
import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsEmail,
  MinLength,
} from 'class-validator'; // Pastikan IsEmail dan MinLength diimpor di sini

export class CreateSekolahDto {
  @IsString()
  @IsNotEmpty()
  nama_sekolah: string;

  @IsString()
  @IsNotEmpty()
  jenjang: string;

  @IsNotEmpty()
  @IsString()
  npsn: string;

  @IsNotEmpty()
  @IsString()
  akreditasi: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsNumber()
  @IsNotEmpty()
  id_wilayah: number;

  @IsOptional()
  @IsNumber()
  jumlah_guru?: number;

  @IsOptional()
  @IsNumber()
  jumlah_siswa?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  // --- KREDENSIAL LOGIN ---
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty()
  email_login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password minimal harus 8 karakter' })
  password_login: string;
}
