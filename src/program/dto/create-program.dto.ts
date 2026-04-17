/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  nama_program: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsNotEmpty()
  @IsString()
  id_sekolah: string;

  @IsNotEmpty()
  @IsString()
  id_pengawas: string;

  @IsOptional()
  @IsString()
  id_vendor?: string;

  @IsString()
  @IsNotEmpty()
  kategori: string;

  @IsString()
  @IsNotEmpty()
  status_program: string;

  @IsOptional()
  @IsString()
  tahun?: string;

  @IsOptional()
  @IsString()
  tanggal_mulai?: string;

  @IsOptional()
  @IsString()
  tanggal_selesai?: string;
}
