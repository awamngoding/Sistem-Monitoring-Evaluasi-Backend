/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Assessment } from './entities/assessment.entity';
import { AssessmentPertanyaan } from './entities/assessment-pertanyaan.entity';
import { AssessmentJawaban } from './entities/assessment-jawaban.entity';
import { Sekolah } from '../sekolah/entities/sekolah.entity';
import { User } from '../users/user.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepo: Repository<Assessment>,

    @InjectRepository(AssessmentPertanyaan)
    private pertanyaanRepo: Repository<AssessmentPertanyaan>,

    @InjectRepository(AssessmentJawaban)
    private jawabanRepo: Repository<AssessmentJawaban>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Sekolah)
    private sekolahRepo: Repository<Sekolah>,
  ) {}

  async create(dto: CreateAssessmentDto) {
    const assessment = await this.assessmentRepo.save({
      id_ho: dto.id_ho,
      nama: dto.nama,
      id_sekolah: dto.id_sekolah,
      tenggat: dto.tenggat ?? 7,
      jenis: dto.jenis ?? 'non-akademik',
      status: 'Siap Diajukan',
      aktif: true,
    });

    for (let i = 0; i < dto.questions.length; i++) {
      await this.pertanyaanRepo.save({
        id_assessment: assessment.id_assessment,
        pertanyaan: dto.questions[i].question,
        options: dto.questions[i].options,
        urutan: i + 1,
      });
    }

    return {
      message: 'Assessment berhasil dibuat',
      id_assessment: assessment.id_assessment,
    };
  }

  /* eslint-disable prettier/prettier */
  async findAll(jenis?: string, id_ho?: number) {
    const query = this.assessmentRepo
      .createQueryBuilder('a')
      // 1. Join ke Users (HO) dan Sekolah
      .leftJoin('m_users', 'u', 'u.id_user = a.id_ho')
      .leftJoin('m_sekolah', 's', 's.id_sekolah = a.id_sekolah')

      // 2. Join ke Pertanyaan dulu sebelum ke Jawaban (Lebih efisien daripada subquery IN)
      .leftJoin(
        't_assessment_pertanyaan',
        'ap',
        'ap.id_assessment = a.id_assessment',
      )
      .leftJoin(
        'assessment_jawaban',
        'aj',
        'aj.id_pertanyaan = ap.id_pertanyaan',
      )

      .select([
        'a.id_assessment AS id_assessment',
        'a.nama AS nama',
        'a.status AS status',
        'a.aktif AS aktif',
        'a.sent_at AS sent_at',
        'a.tenggat AS tenggat',
        'a.jenis AS jenis',
        'u.nama AS ho',
        's.nama_sekolah AS sekolah',
        // Menghitung jumlah unik guru yang mengisi
        'COUNT(DISTINCT aj.nama_pengisi) AS jumlah_pengisi',
        // Menggabungkan nama-nama guru menjadi satu string (Khusus PostgreSQL)
        "STRING_AGG(DISTINCT aj.nama_pengisi, ', ') AS daftar_nama_guru",
      ])
      // 3. Pastikan semua kolom non-aggregate masuk ke Group By
      .groupBy('a.id_assessment, u.nama, s.nama_sekolah');

    // 4. Handle Filtering
    if (jenis) {
      query.andWhere('a.jenis = :jenis', { jenis });
    }

    if (id_ho) {
      query.andWhere('a.id_ho = :id_ho', { id_ho });
    }

    return query.getRawMany();
  }

  async findOne(id: number) {
    const assessment = await this.assessmentRepo.findOne({
      where: { id_assessment: id },
    });
    if (!assessment) throw new Error('Assessment tidak ditemukan');

    const pertanyaan = await this.pertanyaanRepo.find({
      where: { id_assessment: id },
      order: { urutan: 'ASC' },
    });

    const semuaJawaban = await this.jawabanRepo
      .createQueryBuilder('aj')
      .innerJoin(
        't_assessment_pertanyaan',
        'ap',
        'ap.id_pertanyaan = aj.id_pertanyaan',
      )
      .where('ap.id_assessment = :id', { id })
      .getMany();

    const questionsWithStats = pertanyaan.map((p) => {
      const stats = p.options.map((opt) => ({
        label: opt,
        count: semuaJawaban.filter(
          (j) => j.id_pertanyaan === p.id_pertanyaan && j.jawaban === opt,
        ).length,
      }));

      return {
        id_pertanyaan: p.id_pertanyaan,
        question: p.pertanyaan,
        options: p.options,
        stats: stats,
      };
    });

    const daftarNamaUnique = [
      ...new Set(semuaJawaban.map((j) => j.nama_pengisi)),
    ].filter((nama) => nama !== null);

    return {
      id_assessment: assessment.id_assessment,
      nama: assessment.nama,
      status: assessment.status,
      aktif: assessment.aktif,
      total_pengisi: daftarNamaUnique.length,
      daftar_pengisi: daftarNamaUnique,
      questions: questionsWithStats,
    };
  }

  async toggleAktif(id: number) {
    const assessment = await this.assessmentRepo.findOne({
      where: { id_assessment: id },
    });

    if (!assessment) throw new Error('Assessment tidak ditemukan');

    assessment.aktif = !assessment.aktif;
    return this.assessmentRepo.save(assessment);
  }

  async update(id: number, body: any) {
    const assessment = await this.assessmentRepo.findOne({
      where: { id_assessment: id },
    });
    if (!assessment) throw new Error('Assessment tidak ditemukan');

    await this.pertanyaanRepo.delete({ id_assessment: id });

    const questions = body.questions || [];
    for (let i = 0; i < questions.length; i++) {
      await this.pertanyaanRepo.save({
        id_assessment: id,
        pertanyaan: questions[i].question,
        options: questions[i].options,
        urutan: i + 1,
      });
    }

    return { message: 'Assessment berhasil diperbarui' };
  }

  async findBySekolah(id_sekolah: number, id_user: number) {
    try {
      // 1. Pastikan ID Sekolah dan User adalah angka yang valid
      let cleanIdSekolah = Number(id_sekolah);
      const cleanIdUser = Number(id_user);

      // Jika sekolah tidak ada di token, coba fallback ke user atau email yang terkait
      if (isNaN(cleanIdSekolah) || cleanIdSekolah <= 0) {
        if (!isNaN(cleanIdUser) && cleanIdUser > 0) {
          const user = await this.userRepo.findOne({
            where: { id_user: cleanIdUser },
          });

          if (user?.id_sekolah) {
            cleanIdSekolah = user.id_sekolah;
          } else if (user?.email) {
            const sekolah = await this.sekolahRepo.findOne({
              where: { email_login: user.email },
            });
            if (sekolah) {
              cleanIdSekolah = sekolah.id_sekolah;
            }
          }

          if (
            (isNaN(cleanIdSekolah) || cleanIdSekolah <= 0) &&
            user?.nama
          ) {
            const sekolahByName = await this.sekolahRepo.findOne({
              where: { nama_sekolah: user.nama },
            });
            if (sekolahByName) {
              cleanIdSekolah = sekolahByName.id_sekolah;
            }
          }
        }
      }

      // Kalau ID Sekolah masih tidak valid, jangan tanya ke DB, balikin array kosong
      if (isNaN(cleanIdSekolah) || cleanIdSekolah <= 0) return [];

      // 2. Tarik data assessment dasar
      const assessments = await this.assessmentRepo
        .createQueryBuilder('a')
        .leftJoin('m_users', 'u', 'u.id_user = a.id_ho')
        .select([
          'a.id_assessment AS id_assessment',
          'a.nama AS nama',
          'a.status AS status',
          'a.aktif AS aktif',
          'a.sent_at AS sent_at',
          'a.tenggat AS tenggat',
          'u.nama AS ho',
        ])
        .where('a.id_sekolah = :id_sekolah', { id_sekolah: cleanIdSekolah })
        .getRawMany();

      // 3. Loop untuk cek apakah sudah diisi oleh user spesifik
      for (const a of assessments) {
        const pertanyaan = await this.pertanyaanRepo.find({
          where: { id_assessment: a.id_assessment },
        });

        // HANYA hitung jumlah jawaban jika cleanIdUser valid (bukan NaN) dan ada pertanyaan
        if (!isNaN(cleanIdUser) && cleanIdUser > 0 && pertanyaan.length > 0) {
          const ids = pertanyaan.map((p) => p.id_pertanyaan);

          const jumlah = await this.jawabanRepo
            .createQueryBuilder('aj')
            .where('aj.id_pertanyaan IN (:...ids)', { ids })
            .andWhere('aj.id_user = :id_user', { id_user: cleanIdUser })
            .getCount();

          a.sudah_diisi = jumlah > 0;
        } else {
          a.sudah_diisi = false;
        }
      }

      return assessments;
    } catch (error) {
      console.error(
        'CRITICAL ERROR findBySekolah:',
        error instanceof Error ? error.message : error,
      );
      // Supaya frontend tidak 500, kita kembalikan array kosong sebagai fallback
      return [];
    }
  }

  async jawab(
    id_assessment: number,
    body: {
      id_user: number; // Dari JWT (ID Sekolah)
      nama_pengisi: string; // Dari Input Form (Nama Guru)
      jawaban: { id_pertanyaan: number; jawaban: string; skor?: number }[];
    },
  ) {
    // Gunakan map untuk eksekusi paralel agar respon API kencang
    const simpanJawaban = body.jawaban.map((j) => {
      return this.jawabanRepo.save({
        id_pertanyaan: j.id_pertanyaan,
        id_user: body.id_user,
        nama_pengisi: body.nama_pengisi,
        jawaban: j.jawaban,
        skor: j.skor || 0,
      });
    });

    await Promise.all(simpanJawaban);

    return {
      success: true,
      message: `Assessment berhasil dikirim oleh ${body.nama_pengisi}`,
    };
  }

  async send(id: number) {
    const assessment = await this.assessmentRepo.findOne({
      where: { id_assessment: id },
    });
    if (!assessment) throw new Error('Assessment tidak ditemukan');

    assessment.status = 'Proses Pengisian';
    assessment.sent_at = new Date();
    await this.assessmentRepo.save(assessment);

    return { message: 'Assessment berhasil dikirim' };
  }
}
