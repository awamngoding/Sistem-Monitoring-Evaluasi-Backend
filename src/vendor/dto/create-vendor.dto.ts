/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
} from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  nama_vendor: string; // Nama Lembaga

  @IsString()
  @IsOptional()
  no_register?: string;

  @IsString()
  @IsOptional()
  npwp_file?: string;

  // --- DATA PENANGGUNG JAWAB ---
  @IsString()
  @IsNotEmpty()
  pj_1: string;

  @IsString()
  @IsNotEmpty()
  telp_pj_1: string;

  @IsString()
  @IsOptional()
  pj_2?: string;

  @IsString()
  @IsOptional()
  telp_pj_2?: string;

  @IsString()
  @IsOptional()
  ktp_pj_file?: string;

  // --- PILAR & AKSES ---
  @IsString()
  @IsNotEmpty()
  pilar: string; // [Akademik, Karakter, Seni Budaya, Kecakapan Hidup]

  @IsEmail()
  @IsNotEmpty()
  email: string; // Penting untuk login PJ

  @IsString()
  @IsNotEmpty()
  password: string; // Penting untuk login PJ

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  // id_user opsional dikirim atau dihandle di service
  @IsOptional()
  @IsNumber()
  id_user?: number;
}
