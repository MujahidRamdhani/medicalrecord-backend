import 'dotenv/config'; // Load .env automatically
import argon2 from 'argon2';
import prismaClient from './src/applications/database.js';
import util from './src/utils/util.js';
import invoke from './src/applications/invoke.js';

const main = async () => {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging line
    const email = 'dokter.admin@rekammedis.co.id';
    const role = 'dokter';
    await prismaClient.akun.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        password: await argon2.hash('Dokter@RekamMedis2025'),
        role: util.getAttributeName('dokter').databaseRoleName,
        [util.getAttributeName('dokter').tableName]: {
          create: {
            nama: 'Andi Saputra',
            alamat: 'Jl. Merdeka No. 45, Kelurahan Sukamaju, Kecamatan Cibinong, Kabupaten Bogor, Jawa Barat',
            nomorTelepon: '087534552628',
            nip: '198701012022011001',
            jenisKelamin: 'LAKILAKI',
            spesialis: 'UMUM',
            idPelayananKesehatan: 'f0525a5d-2fcd-47f4-95a9-8fba0fa4ab2a',
          },
        },
      },
    });
    console.log("User seeded successfully!");
    await invoke.enrollAdmin(email, role);
    console.log("Admin enrolled successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prismaClient.$disconnect();
  }
};

main().catch((e) => {
  console.error("Unhandled error:", e);
  process.exit(1);
});