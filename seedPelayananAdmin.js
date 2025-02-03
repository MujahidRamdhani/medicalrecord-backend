import 'dotenv/config'; // Load .env automatically
import argon2 from 'argon2';
import prismaClient from './src/applications/database.js';

import util from './src/utils/util.js';
import invoke from './src/applications/invoke.js';

const main = async () => {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging line
    const email = 'adminpelayanan.admin@rekammedis.co.id';
    const role = 'adminpelayanan';
    await prismaClient.akun.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        password: await argon2.hash('AdminPelayanan@RekamMedis2025'),
        role: util.getAttributeName('adminpelayanan').databaseRoleName,
        [util.getAttributeName('adminpelayanan').tableName]: {
          create: {
            nama: 'Budi Santoso',
            alamat: 'Jl. Sudirman No. 45, Jakarta Selatan',
            nomorTelepon: '089622413522',
            nip: '199005232019121002',
            jenisKelamin: 'LAKILAKI',
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
