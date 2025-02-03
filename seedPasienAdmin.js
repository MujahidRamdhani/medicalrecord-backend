import 'dotenv/config'; // Load .env automatically
import argon2 from 'argon2';
import prismaClient from './src/applications/database.js';

import util from './src/utils/util.js';
import invoke from './src/applications/invoke.js';

const main = async () => {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging line
    const email = 'pasien.admin@rekammedis.co.id';
    const role = 'pasien';
    await prismaClient.akun.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        password: await argon2.hash('Pasien@RekamMedis2025'),
        role: util.getAttributeName('pasien').databaseRoleName,
        [util.getAttributeName('pasien').tableName]: {
          create: {
            nik: '3204053008790005',
            noRM: 'RM-3204053008790005',
            nama: 'Evi Lestari',
            alamat: ' Jl. Anggrek No. 14, Kelurahan Gondangdia, Kecamatan Menteng, Kota Jakarta Pusat, DKI Jakarta',
            nomorTelepon: '086534425557', 
            jenisKelamin: 'PEREMPUAN',
            tempatLahir: 'DKI Jakarta',
            tanggalLahir: '2002-11-11T00:00:00Z',
            agama: 'ISLAM',
            golonganDarah: 'B',
            pekerjaan: 'PEGAWAI SWASTA',
            kewarganegaraan: 'WNI',
            idPelayananKesehatan: 'f0525a5d-2fcd-47f4-95a9-8fba0fa4ab2a',
          },
        },
      },
      
    });

   await invoke.enrollAdmin(email, role)
  } catch (error) {
    console.error(error);
  }
};

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
