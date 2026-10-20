import { prisma } from "../config/prisma.js";

interface CreateApplicantInput {
  nik: string;
  nama: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  alamat?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  kelurahan?: string;
  noHp?: string;
  email?: string;
  pendidikan?: string;
  instansi?: string;
  jurusan?: string;
  pekerjaan?: string;
}

export const getMyApplicant = async (userId: number) => {
  return prisma.applicant.findUnique({
    where: {
      userId,
    },
  });
};

export const createMyApplicant = async (
  userId: number,
  data: CreateApplicantInput,
) => {
  // Cek apakah user sudah memiliki applicant
  const existingApplicant = await prisma.applicant.findUnique({
    where: {
      userId,
    },
  });

  if (existingApplicant) {
    throw new Error("Applicant sudah terdaftar");
  }

  // Cek NIK
  const existingNik = await prisma.applicant.findUnique({
    where: {
      nik: data.nik,
    },
  });

  if (existingNik) {
    throw new Error("NIK sudah terdaftar");
  }

  const applicantData = {
    userId,
    nik: data.nik,
    nama: data.nama,

    ...(data.tempatLahir !== undefined && {
      tempatLahir: data.tempatLahir,
    }),

    ...(data.tanggalLahir !== undefined && {
      tanggalLahir: new Date(data.tanggalLahir),
    }),

    ...(data.jenisKelamin !== undefined && {
      jenisKelamin: data.jenisKelamin,
    }),

    ...(data.alamat !== undefined && {
      alamat: data.alamat,
    }),

    ...(data.provinsi !== undefined && {
      provinsi: data.provinsi,
    }),

    ...(data.kabupaten !== undefined && {
      kabupaten: data.kabupaten,
    }),

    ...(data.kecamatan !== undefined && {
      kecamatan: data.kecamatan,
    }),

    ...(data.kelurahan !== undefined && {
      kelurahan: data.kelurahan,
    }),

    ...(data.noHp !== undefined && {
      noHp: data.noHp,
    }),

    ...(data.email !== undefined && {
      email: data.email,
    }),

    ...(data.pendidikan !== undefined && {
      pendidikan: data.pendidikan,
    }),

    ...(data.instansi !== undefined && {
      instansi: data.instansi,
    }),

    ...(data.jurusan !== undefined && {
      jurusan: data.jurusan,
    }),

    ...(data.pekerjaan !== undefined && {
      pekerjaan: data.pekerjaan,
    }),
  };

  return prisma.applicant.create({
    data: applicantData,
  });
};

export const updateMyApplicant = async (
  userId: number,
  data: Partial<CreateApplicantInput>,
) => {
  // Pastikan applicant milik user yang sedang login
  const applicant = await prisma.applicant.findUnique({
    where: {
      userId,
    },
  });

  if (!applicant) {
    throw new Error("Applicant tidak ditemukan");
  }

  // Jika NIK diubah, cek apakah sudah digunakan applicant lain
  if (data.nik !== undefined && data.nik !== applicant.nik) {
    const existingNik = await prisma.applicant.findUnique({
      where: {
        nik: data.nik,
      },
    });

    if (existingNik) {
      throw new Error("NIK sudah terdaftar");
    }
  }

  const updateData = {
    ...(data.nik !== undefined && {
      nik: data.nik,
    }),

    ...(data.nama !== undefined && {
      nama: data.nama,
    }),

    ...(data.tempatLahir !== undefined && {
      tempatLahir: data.tempatLahir,
    }),

    ...(data.tanggalLahir !== undefined && {
      tanggalLahir: new Date(data.tanggalLahir),
    }),

    ...(data.jenisKelamin !== undefined && {
      jenisKelamin: data.jenisKelamin,
    }),

    ...(data.alamat !== undefined && {
      alamat: data.alamat,
    }),

    ...(data.provinsi !== undefined && {
      provinsi: data.provinsi,
    }),

    ...(data.kabupaten !== undefined && {
      kabupaten: data.kabupaten,
    }),

    ...(data.kecamatan !== undefined && {
      kecamatan: data.kecamatan,
    }),

    ...(data.kelurahan !== undefined && {
      kelurahan: data.kelurahan,
    }),

    ...(data.noHp !== undefined && {
      noHp: data.noHp,
    }),

    ...(data.email !== undefined && {
      email: data.email,
    }),

    ...(data.pendidikan !== undefined && {
      pendidikan: data.pendidikan,
    }),

    ...(data.instansi !== undefined && {
      instansi: data.instansi,
    }),

    ...(data.jurusan !== undefined && {
      jurusan: data.jurusan,
    }),

    ...(data.pekerjaan !== undefined && {
      pekerjaan: data.pekerjaan,
    }),
  };

  return prisma.applicant.update({
    where: {
      userId,
    },
    data: updateData,
  });
};