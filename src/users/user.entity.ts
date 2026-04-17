/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';
import { Wilayah } from '../wilayah/entities/wilayah.entity';
import { Sekolah } from '../sekolah/entities/sekolah.entity';

@Entity('m_users')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  nama: string;

  @Column({ unique: true }) // Email unik untuk login
  email: string;

  @Column({ select: false }) // PENTING: Password tidak akan ikut ditarik saat query biasa (keamanan)
  password: string;

  @Column({ nullable: true })
  jabatan: string;

  @Column({ nullable: true })
  no_telp: string;

  @Column({ nullable: true })
  jenis: string; // Bisa untuk membedakan kategori user (Internal/External)

  @Column({ nullable: true })
  sub_jenis: string;

  @Column({ default: true })
  status: boolean;

  // --- RELASI KE ROLE (Admin, Sekolah, Vendor) ---
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @RelationId((user: User) => user.role)
  id_role: number;

  // --- RELASI KE WILAYAH (Untuk Admin Regional) ---
  @OneToMany(() => Wilayah, (wilayah) => wilayah.user)
  wilayah: Wilayah[];

  // --- RELASI KE SEKOLAH (Khusus User Sekolah) ---
  @ManyToOne(() => Sekolah, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_sekolah' })
  sekolah: Sekolah;

  @RelationId((user: User) => user.sekolah)
  id_sekolah: number;

  // --- TIMESTAMPS ---
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
