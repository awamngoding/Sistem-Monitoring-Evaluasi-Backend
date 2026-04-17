/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
  @IsOptional()
  @IsString()
  status?: string; // Di sini baru boleh update status
}
