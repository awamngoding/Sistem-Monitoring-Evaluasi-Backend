/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Assessment } from './entities/assessment.entity';
import { AssessmentPertanyaan } from './entities/assessment-pertanyaan.entity';
import { AssessmentJawaban } from './entities/assessment-jawaban.entity';
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

  async findAll(jenis?: string) {
    const query = this.assessmentRepo
      .createQueryBuilder('a')
      .leftJoin('users', 'u', 'u.id_user = a.id_ho')
      .leftJoin('sekolah', 's', 's.id_sekolah = a.id_sekolah')
      .leftJoin(
        'assessment_jawaban',
        'aj',
        'aj.id_pertanyaan IN (SELECT id_pertanyaan FROM assessment_pertanyaan WHERE id_assessment = a.id_assessment)',
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
        'COUNT(DISTINCT aj.nama_pengisi) AS jumlah_pengisi',
      ])
      .groupBy('a.id_assessment, u.nama, s.nama_sekolah');

    if (jenis) {
      query.where('a.jenis = :jenis', { jenis });
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

    // 1. Ambil semua jawaban untuk assessment ini (Termasuk nama pengisinya)
    const semuaJawaban = await this.jawabanRepo
      .createQueryBuilder('aj')
      .innerJoin(
        'assessment_pertanyaan',
        'ap',
        'ap.id_pertanyaan = aj.id_pertanyaan',
      )
      .where('ap.id_assessment = :id', { id })
      .getMany();

    // 2. Map pertanyaan dengan statistik jawaban
    const questionsWithStats = pertanyaan.map((p) => {
      // Hitung statistik per opsi jawaban
      const stats = p.options.map((opt) => ({
        label: opt,
        // Hitung berapa kali opsi ini muncul di tabel jawaban untuk pertanyaan ini
        count: semuaJawaban.filter(
          (j) => j.id_pertanyaan === p.id_pertanyaan && j.jawaban === opt,
        ).length,
      }));

      return {
        id_pertanyaan: p.id_pertanyaan,
        question: p.pertanyaan,
        options: p.options,
        stats: stats, // Data ini yang akan jadi diagram batang
      };
    });

    // 3. Ambil daftar nama pengisi unik
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
    const assessments = await this.assessmentRepo
      .createQueryBuilder('a')
      .leftJoin('users', 'u', 'u.id_user = a.id_ho')
      .select([
        'a.id_assessment AS id_assessment',
        'a.nama AS nama',
        'a.status AS status',
        'a.aktif AS aktif',
        'a.sent_at AS sent_at',
        'a.tenggat AS tenggat',
        'u.nama AS ho',
      ])
      .where('a.id_sekolah = :id_sekolah', { id_sekolah })
      .andWhere('a.aktif = true')
      .andWhere('a.status IN (:...statuses)', {
        statuses: ['Proses Pengisian', 'Sudah Dilengkapi'],
      })
      .getRawMany();

    for (const a of assessments) {
      const pertanyaan = await this.pertanyaanRepo.find({
        where: { id_assessment: a.id_assessment },
      });
      const ids = pertanyaan.map((p) => p.id_pertanyaan);

      const jumlah = await this.jawabanRepo
        .createQueryBuilder('aj')
        .where('aj.id_pertanyaan IN (:...ids)', { ids: ids.length ? ids : [0] })
        .andWhere('aj.id_user = :id_user', { id_user })
        .getCount();

      a.sudah_diisi = jumlah > 0;
    }

    return assessments;
  }

  async jawab(
    id_assessment: number,
    body: {
      id_user: number;
      nama_pengisi: string;
      jawaban: { id_pertanyaan: number; jawaban: string }[];
    },
  ) {
    for (const j of body.jawaban) {
      await this.jawabanRepo.save({
        id_pertanyaan: j.id_pertanyaan,
        id_user: body.id_user,
        nama_pengisi: body.nama_pengisi,
        jawaban: j.jawaban,
      });
    }
    return { message: 'Jawaban berhasil disimpan' };
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
