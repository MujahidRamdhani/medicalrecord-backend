import 'dotenv/config'; // Load .env automatically
import argon2 from 'argon2';
import prismaClient from './src/applications/database.js';

import util from './src/utils/util.js';
import invoke from './src/applications/invoke.js';

const main = async () => {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL); // Debugging line
    const email = 'adminsistem.admin@rekammedis.co.id';
    const role = 'adminsistem';
    await prismaClient.akun.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        password: await argon2.hash('AdminSistem@RekamMedis2025'),
        role: util.getAttributeName('adminsistem').databaseRoleName,
        [util.getAttributeName('adminsistem').tableName]: {
          create: {
            nama: 'John Doe',
            idAdminSistem: '198412051998031003',
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
