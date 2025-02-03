import argon2 from 'argon2';
import prismaClient from '../applications/database.js';
import ResponseError from '../errors/response-error.js';
import validate from '../validations/validation.js';
import { registerUserValidation, loginUserValidation, meValidation } from '../validations/auth-validation.js';
import util from '../utils/util.js';
import invoke from '../applications/invoke.js';
import wallet from '../applications/wallet.js';



const register = async (request) => {
  // Validate request data
  const userRequest = validate(registerUserValidation, request);
  console.log(userRequest.role);

  // Role names and table names
  const { tableName, databaseRoleName, roleName, organizationName, affiliationName } = util.getAttributeName(userRequest.role);
  
  
  // Check for existing email
  const countAkun = await prismaClient.akun.count({
    where: {
      email: userRequest.email,
    },
  });

  if (countAkun === 1) {
    throw new ResponseError(400, 'Email sudah terdaftar');
  }

  // Hash password
  userRequest.password = await argon2.hash(userRequest.password);

  let data;
  
  // Prepare data based on role
  if (roleName === 'adminsistem') {
    data = {
      email: userRequest.email,
      password: userRequest.password,
      role: databaseRoleName,
      [tableName]: {
        create: {
          idAdminSistem: userRequest.idAdminSistem,
          nama: userRequest.nama,
        },
      },
    };
  } 
  
  // else if (roleName === 'adminpelayanan') {
  //   data = {
  //     email: userRequest.email,
  //     password: userRequest.password,
  //     role: databaseRoleName,
  //     [tableName]: {
  //       create: {
  //         nip: userRequest.nip,
  //         nama: userRequest.nama,
  //         jenisKelamin: userRequest.jenisKelamin,
  //         alamat: userRequest.alamat,
  //         nomorTelepon: userRequest.nomorTelepon,
  //         //kodePelayanan: userRequest.kodePelayanan,
  //       },
  //     },
  //   };
  // }

  //backup2
  // else if (roleName === 'adminpelayanan') {
  //   let pelayananKesehatan;
  
  //   // Cek apakah kodePelayanan sudah ada di pelayananKesehatan
  //   const existingPelayanan = await prismaClient.pelayananKesehatan.findUnique({
  //     where: { kodePelayanan: userRequest.kodePelayanan },
  //   });
  
  //   if (!existingPelayanan) {
  //     // Jika belum ada, buat data baru
  //     pelayananKesehatan = await prismaClient.pelayananKesehatan.create({
  //       data: {
  //         kodePelayanan: userRequest.kodePelayanan,
  //         nama: userRequest.namaPelayanan,
  //         tipe: userRequest.tipePelayanan,
  //         alamat: userRequest.alamatPelayanan,
  //         nomorTelepon: userRequest.nomorTeleponPelayanan,
  //       },
  //     });
  //   } else {
  //     // Jika sudah ada, gunakan data yang ditemukan
  //     pelayananKesehatan = existingPelayanan;
  //   }
  
  //   // Setelah pelayananKesehatan dibuat, buat data adminpelayanan
  //   data = {
  //     email: userRequest.email,
  //     password: userRequest.password,
  //     role: databaseRoleName,
  //     [tableName]: {
  //       create: {
  //         nip: userRequest.nip,
  //         nama: userRequest.nama,
  //         jenisKelamin: userRequest.jenisKelamin,
  //         alamat: userRequest.alamat,
  //         nomorTelepon: userRequest.nomorTelepon,
  //         idPelayananKesehatan: pelayananKesehatan.id,
  //       },
  //     },
  //   };
  // }

  else if (roleName === 'adminpelayanan') {
    let pelayananKesehatan;
    const tipePelayanan = userRequest.tipePelayanan;
  
    // Tentukan prefix berdasarkan tipe pelayanan
    let prefix;
    if (tipePelayanan === 'RUMAHSAKIT') {
      prefix = 'RS';
    } else if (tipePelayanan === 'PUSKESMAS') {
      prefix = 'PKM';
    } else if (tipePelayanan === 'KLINIK') {
      prefix = 'KLN';
    } else {
      throw new Error('Tipe pelayanan tidak valid.');
    }
  
    // Cari kode pelayanan terbaru berdasarkan prefix
    const latestPelayanan = await prismaClient.pelayananKesehatan.findMany({
      where: { tipe: tipePelayanan },
      orderBy: { kodePelayanan: 'desc' },
      take: 1,
    });
  
    // Generate kode pelayanan baru
    let newKodePelayanan;
    if (latestPelayanan.length === 0) {
      newKodePelayanan = `${prefix}-0001`;
    } else {
      const latestKode = latestPelayanan[0].kodePelayanan;
      const latestNumber = parseInt(latestKode.split('-')[1], 10);
      newKodePelayanan = `${prefix}-${String(latestNumber + 1).padStart(4, '0')}`;
    }
  
    // Cek apakah kode pelayanan
    const existingPelayanan = await prismaClient.pelayananKesehatan.findUnique({
      where: { kodePelayanan: newKodePelayanan },
    });
  
    if (!existingPelayanan) {
      // Jika belum ada, buat data baru
      pelayananKesehatan = await prismaClient.pelayananKesehatan.create({
        data: {
          kodePelayanan: newKodePelayanan,
          nama: userRequest.namaPelayanan,
          tipe: userRequest.tipePelayanan,
          alamat: userRequest.alamatPelayanan,
          nomorTelepon: userRequest.nomorTeleponPelayanan,
        },
      });
    } else {
      // Jika sudah ada, gunakan data yang ditemukan
      pelayananKesehatan = existingPelayanan;
    }
  
    // Setelah pelayananKesehatan dibuat, buat data adminpelayanan
    data = {
      email: userRequest.email,
      password: userRequest.password,
      role: databaseRoleName,
      [tableName]: {
        create: {
          nip: userRequest.nip,
          nama: userRequest.nama,
          jenisKelamin: userRequest.jenisKelamin,
          alamat: userRequest.alamat,
          nomorTelepon: userRequest.nomorTelepon,
          idPelayananKesehatan: pelayananKesehatan.id,
        },
      },
    };
  }
  
  else if (roleName === 'dokter') {
    data = {
      email: userRequest.email,
      password: userRequest.password,
      role: databaseRoleName,
      [tableName]: {
        create: {
          nip: userRequest.nip,
          nama: userRequest.nama,
          jenisKelamin: userRequest.jenisKelamin,
          spesialis: userRequest.spesialis,
          alamat: userRequest.alamat,
          nomorTelepon: userRequest.nomorTelepon,
          idPelayananKesehatan: userRequest.idPelayananKesehatan,
        },
      },
    };
  }else if (roleName === 'pasien') {
    data = {
      email: userRequest.email,
      password: userRequest.password,
      role: databaseRoleName,
      [tableName]: {
        create: {
          nik: userRequest.nik,
          nama: userRequest.nama,
          noRM: userRequest.noRM,
          jenisKelamin: userRequest.jenisKelamin,
          tempatLahir: userRequest.tempatLahir,
          tanggalLahir: userRequest.tanggalLahir,
          alamat: userRequest.alamat,
          agama: userRequest.agama,
          golonganDarah: userRequest.golonganDarah,
          pekerjaan: userRequest.pekerjaan,
          kewarganegaraan: userRequest.kewarganegaraan,
          nomorTelepon: userRequest.nomorTelepon,
          idPelayananKesehatan: userRequest.idPelayananKesehatan,
        },
      },
    }
  }else {
    throw new ResponseError(400, 'Invalid role');
  }

  // Register to database
  const userAccount = await prismaClient.akun.create({
    data,
    select: {
      [tableName]: {
        select: {
          nama: true,
        },
      },
      id: true,
      email: true,
    },
  });

  if (!userAccount) {
    throw new ResponseError(500, 'Gagal membuat akun');
  }
  if(roleName === "dokter" || roleName === "pasien"){
    const emailUser = userRequest.email
    const roleUser = userRequest.role
    await invoke.registerAndEnrollUser(emailUser, roleUser);
  }
  // Return the registered user data
  return {
    nama: userAccount[tableName].nama,
    email: userAccount.email,
    role: roleName,
  };
};



// backup
// const login = async (session, request) => {
//   const userRequest = validate(loginUserValidation, request);

//   const akun = await prismaClient.akun.findUnique({
//     where: {
//       email: userRequest.email,
//     },
//     select: {
//       id: true,
//       email: true,
//       password: true,
//       role: true,
//     },
//   });

//   if (!akun) {
//     throw new ResponseError(404, 'Akun pengguna tidak terdaftar');
//   }

//   const isPasswordValid = await argon2.verify(akun.password, userRequest.password);
//   if (!isPasswordValid) {
//     throw new ResponseError(401, 'Email atau password salah');
//   }

//   const { tableName, roleName } = util.getAttributeName(akun.role);
//   const user = await prismaClient[tableName].findUnique({
//     where: {
//       idAkun: akun.id,
//     },
//     select: {
//       nama: true,
//     },
//   });

//   session.userEmail = akun.email;

//   return {
//     nama: user.nama,
//     email: akun.email,
//     role: roleName,
//   };
// };

const login = async (session, request) => {
  const userRequest = validate(loginUserValidation, request);

  const akun = await prismaClient.akun.findUnique({
    where: {
      email: userRequest.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!akun) {
     throw new ResponseError(404, 'Akun pengguna tidak terdaftar');
  }

  const isPasswordValid = await argon2.verify(akun.password, userRequest.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, 'Email atau password salah');
  }

  //validasi Ca
  const identity = await wallet.getIdentity(userRequest.email);
    
    if (!identity) {
      throw new ResponseError(403, 'Akun Belum Mempunyai Certificate Authory');
    }

  const { tableName, roleName } = util.getAttributeName(akun.role);
  let user;
  let idRole;
  console.log('rolename', roleName)
  console.log('tableName', tableName)
  if(roleName === 'adminsistem') {
    user = await prismaClient.adminSistem.findUnique({
      where: {
        idAkun: akun.id, 
      },
      select: {
        nama: true,
        idAdminSistem: true,
      },
    });
   idRole = user.idAdminSistem
   }else if(roleName === 'adminpelayanan') {
    user = await prismaClient.adminPelayanan.findUnique({
      where: {
        idAkun: akun.id,
      },
      select: {
        nama: true,
        nip: true,
      },
    });
  idRole = user.nip
  console.log('user', user)
   }else if( roleName === 'dokter') {
    user = await prismaClient[tableName].findUnique({
      where: {
        idAkun: akun.id,
      },
      select: {
        nama: true,
        nip: true,
      },
    });
   idRole = user.nip
   }else if( roleName === 'pasien') {
    user = await prismaClient[tableName].findUnique({
      where: {
        idAkun: akun.id,
      },
      select: {
        nama: true,
        nik: true,
      },
    });
  idRole = user.nik
   }
   
   session.userEmail = akun.email;
   session.userNama = user.nama;
   session.userIdRole = idRole;
   session.userRole = akun.role;


   console.log(idRole, 'idRole')
  return {
    nama: user.nama,
    email: akun.email,
    role: roleName,
    idRole: idRole,
  };
};



const me = async (email) => {
  // Validate the email
  email = validate(meValidation, email);
  console.log('email', email)
  // Find the user account based on the email
  const akun = await prismaClient.akun.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  // If the account doesn't exist, throw an error
  if (!akun) {
    throw new ResponseError(404, 'Akun pengguna tidak terdaftar');
  }

  // Get the table and role name based on the role
  const { tableName, roleName } = util.getAttributeName(akun.role);

  console.log('tabel', tableName)
  console.log('role', roleName)
  console.log('akunrole', akun.role)

  let user;
  if(roleName == "adminsistem"){
    console.log('Tampil')
    user = await prismaClient.adminSistem.findUnique({
      where: {
        idAkun: akun.id,
      },
      select: {
        nama: true,
      },
    });
  }else if(roleName == "adminpelayanan"){
    user = await prismaClient.adminPelayanan.findUnique({
      where: {
        idAkun: akun.id,
      },
      select: {
        nama: true,
      },
    });
  }else{
    user = await prismaClient[tableName].findUnique({
      where: {
        idAkun: akun.id,
      },
      select: {
        nama: true,
      },
    });
  }
  console.log('user', user)

  // If the user doesn't exist, throw an error
  if (!user) {
    throw new ResponseError(404, 'User not found in the specified table');
  }

  // Return the user information
  return {
    nama: user.nama,
    email: akun.email,
    role: roleName,
  };
};


const logout = async (session) => {
  session.destroy((error) => {
    if (error) {
      throw new ResponseError(400, 'Logout gagal');
    }
  });
};

export const checkSession = async (session, res) => {
  
  if (session.userEmail) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { email: session.userEmail },
      });
      console.log('user',user)
      if (user) {
        res.json({  setName: user.name, role: user.role }); 
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};




const authService = { register, login, me, logout, checkSession };
export default authService;
