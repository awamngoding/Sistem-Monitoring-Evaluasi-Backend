import { PartialType } from '@nestjs/mapped-types';
import { CreateSekolahDto } from './create-sekolah.dto';

export class UpdateSekolahDto extends PartialType(CreateSekolahDto) {}
