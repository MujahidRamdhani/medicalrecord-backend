import argon2 from 'argon2';
import prismaClient from '../applications/database.js';
import ResponseError from '../errors/response-error.js';
//import validate from '../validations/validation.js';
import util from '../utils/util.js';
//import hakAksesServices from './hakakses-service.js';

const update = async (user, request) => {
 const userType = user.role.toLowerCase();
 const userId = await prismaClient[userType].findFirst({
  where: {
    akun: {
      email: request.email,
    },
  },
  select: {
    idAkun: true,
    id: true,
  },
});

console.log('userId Akun', userId);

if (!userId) {
  throw new ResponseError(404, 'User tidak ditemukan');
}
const akunPrev = await prismaClient[userType].findFirst({
  where: {
    idAkun: userId.idAkun,  // Gunakan idAkun dari hasil query pertama
  },
  include: {
    akun: true,  
  },
});

  if (!akunPrev) {
    throw new ResponseError(404, 'Akun tidak ditemukan');
  }

 
  const userPrev = await prismaClient[userType].findFirst({
    where: {
      id: userId.id,
    },
  });

  if (!userPrev) {
    throw new ResponseError(404, 'Pengguna tidak ditemukan');
  }

console.log('userId:', userId);
console.log('akunPrev:', akunPrev);
console.log('userPrev:', userPrev);


  const newUser = {
    nama: request.nama,
    alamat: request.alamat,
    nomorTelepon: request.nomorTelepon,
  };

  if (
    userType === util.getAttributeName('koperasi').databaseRoleName
  ) {
    newUser.niKoperasi = request.idKoperasi;
  }

  if (userType === 'petani') {
    newUser.nik = request.idRole;
    newUser.idKoperasi = request.idKoperasi;
  }

  if (userType === 'dinas') {
    newUser.nip = request.idRole;
  }

  const updatedUser = await prismaClient[userType].update({
    where: {
      idAkun: userId.idAkun,
    },
    data: newUser,
  });
  
  console.log('Updated User:', updatedUser);

  if (!updatedUser) {
    throw new ResponseError(500, 'Gagal memperbarui data pengguna');
  }

  const newAkun = {
    email: request.email,
    profilLengkap: 'TRUE',
  };

  if (request.password !== 'Apabila ingin merubah password maka ubah password disini') {
    newAkun.password = await argon2.hash(request.password);
  }

  const updatedAkun = await prismaClient.akun.update({
    where: {
      id: userId.idAkun,
    },
    data: newAkun,
  });

  if (!updatedAkun) {
    throw new ResponseError(500, 'Gagal memperbarui data akun');
  }

  const updated = await findOneProfil(user);

  return updated;
};


const changePassword = async (email, newPassword) => {
  // Cari akun berdasarkan email
  const akun = await prismaClient.akun.findFirst({
    where: {
      email: email,
    },
  });

  // Jika akun tidak ditemukan, lempar error
  if (!akun) {
    throw new ResponseError(404, 'Akun tidak ditemukan');
  }

  // Hash password baru
  const hashedNewPassword = await argon2.hash(newPassword);

  // Update password di database
  const updatedAkun = await prismaClient.akun.update({
    where: {
      email: email,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  return updatedAkun;
};

const updateProfile = async (idAkun, role, updateData) => {
  // Cari akun berdasarkan idAkun
  const akun = await prismaClient.akun.findUnique({
    where: { id: idAkun },
  });

  // Jika akun tidak ditemukan, lempar error
  if (!akun) {
    throw new ResponseError(404, "Akun tidak ditemukan");
  }

  // Update data sesuai role
  let updatedProfile;
  switch (role) {
    case "ADMINSISTEM":
      updatedProfile = await prismaClient.adminSistem.update({
        where: { idAkun },
        data: updateData,
      });
      break;

    case "ADMINPELAYANAN":
      updatedProfile = await prismaClient.adminPelayanan.update({
        where: { idAkun },
        data: updateData,
      });
      break;

    case "DOKTER":
      updatedProfile = await prismaClient.dokter.update({
        where: { idAkun },
        data: updateData,
      });
      break;

    case "PASIEN":
      updatedProfile = await prismaClient.pasien.update({
        where: { idAkun },
        data: updateData,
      });
      break;

    default:
      throw new ResponseError(400, "Role tidak valid");
  }

  // Kembalikan data yang telah diperbarui
  return updatedProfile;
};


const updateStatusWallet = async (email) => {
  const akunPrev = await prismaClient.akun.findFirst({
    where: {
      email: email,
    },
  });

  if (!akunPrev) {
    throw new ResponseError(404, 'Akun tidak ditemukan');
  }

 
  const updatedAkun = await prismaClient.akun.update({
    where: {
      email: email,
    },
    data: {
      wallet: 'TRUE', 
    },
  });

  

  return updatedAkun;
};



const findAllUser = async () => {
  const akunList = await prismaClient.akun.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      wallet: true,
    },
  });
  console.log("Akun object:", akunList);

  const users = [];

  for (const akun of akunList) {
    const role = akun.role.toLowerCase();
    let userList = [];

    if (role === 'adminsistem') {
      userList = await prismaClient.adminSistem.findMany({
        where: {
          idAkun: akun.id,
        },
        select: {
          idAdminSistem: true,
          idAkun: true,
          nama: true,
        },
      });
    } else if (role === 'dokter') {
      userList = await prismaClient.dokter.findMany({
        where: {
          idAkun: akun.id,
        },
        select: {
          nip: true,
          idAkun: true,
          nama: true,
          jenisKelamin: true,
          spesialis: true,
          alamat: true,
          nomorTelepon: true,
          idPelayananKesehatan: true,
        },
      });
    } else if (role === 'pasien') {
      userList = await prismaClient.pasien.findMany({
        where: {
          idAkun: akun.id,
        },
        select: {
          idAkun: true,
          nik: true,
          noRM: true,
          nama: true,
          jenisKelamin: true,
          tempatLahir: true,
          tanggalLahir: true,
          alamat: true,
          agama: true,
          golonganDarah: true,
          pekerjaan: true,
          kewarganegaraan: true,
          nomorTelepon: true,
          idPelayananKesehatan: true,
        },
      });
    } else if (role === 'adminpelayanan') {
      userList = await prismaClient.AdminPelayanan.findMany({
        where: {
          idAkun: akun.id,
        },
        select: {
          nip: true,
          idAkun: true,
          nama: true,
          jenisKelamin: true,
          alamat: true,
          nomorTelepon: true,
          idPelayananKesehatan: true,
        },
      });
    } else {
      console.warn(`No fields defined for role: ${role}`);
    }

    userList.forEach(user => {
      users.push({
        ...user,
        email: akun.email,
        wallet: akun.wallet,
        role: akun.role,
      });
    });
  }

  console.log("Users object:", users);
  return users;
};

const findAllUserWithoutCA = async () => {
  // Hanya ambil akun dengan wallet = false
  const akunList = await prismaClient.akun.findMany({
    where: {
      wallet: "FALSE", // Tambahkan kondisi ini
    },
    select: {
      id: true,
      email: true,
      role: true,
      wallet: true, // Tetap ambil wallet dari akun
    },
  });
  console.log("Akun object:", akunList);

  const users = [];

  for (const akun of akunList) {
    const role = akun.role.toLowerCase();
    let userList = [];

    if (role === 'dokter') {
      userList = await prismaClient.dokter.findMany({
        where: {
          idAkun: akun.id,
        },
        select: {
          nip: true,
          idAkun: true,
          nama: true,
          jenisKelamin: true,
          spesialis: true,
          alamat: true,
          nomorTelepon: true,
          idPelayananKesehatan: true,
        },
      });
    } else if (role === 'pasien') {
      userList = await prismaClient.pasien.findMany({
        where: {
          idAkun: akun.id,
        },
        select: {
          idAkun: true,
          nik: true,
          noRM: true,
          nama: true,
          jenisKelamin: true,
          tempatLahir: true,
          tanggalLahir: true,
          alamat: true,
          agama: true,
          golonganDarah: true,
          pekerjaan: true,
          kewarganegaraan: true,
          nomorTelepon: true,
          idPelayananKesehatan: true,
        },
      });
    } else if (role === 'adminpelayanan') {
      userList = await prismaClient.AdminPelayanan.findMany({
        where: {
          idAkun: akun.id,
        },
        select: {
          nip: true,
          idAkun: true,
          nama: true,
          jenisKelamin: true,
          alamat: true,
          nomorTelepon: true,
          idPelayananKesehatan: true,
          pelayananKesehatan: { // Include related data from PelayananKesehatan
            select: {
              kodePelayanan: true,
              nama: true,
              tipe: true,
              alamat: true,
              nomorTelepon: true,
            },
          },
        },
      });
    }
     else {
      console.warn(`No fields defined for role: ${role}`);
    }

    userList.forEach(user => {
      users.push({
        ...user,
        email: akun.email,
        wallet: false, // Tetapkan wallet menjadi "false"
        role: akun.role,
      });
    });
  }

  console.log("Users object:", users);
  return users;
};


const findAllUserByNIK = async (NIK) => {
  // Hanya ambil akun dengan wallet = false
  const pasien = await prismaClient.pasien.findUnique({
    where: {
      nik: NIK, // Tambahkan kondisi ini
    },
    select: {
      nik: true,
      noRM: true,
      nama: true,
      jenisKelamin: true,
      tempatLahir: true,
      tanggalLahir: true,
      alamat: true,
      agama: true,
      golonganDarah: true,
      pekerjaan: true,
      kewarganegaraan: true,
      nomorTelepon: true,
      idPelayananKesehatan: true,
    },
  });
  console.log("Akun object:", pasien);
  return pasien;
};

const findAllDokterByIdPelayanan = async (nip) => {
  const adminPelayanan = await prismaClient.adminPelayanan.findFirst({
    where: {
      nip: nip, // Tambahkan kondisi ini
    },
    select: {
      idPelayananKesehatan: true,
    },
  });
 
  const dokter = await prismaClient.dokter.findMany({
    where: {
      idPelayananKesehatan: adminPelayanan.idPelayananKesehatan, 
    },
    select: {
      nip: true,
      idAkun: true,
      nama: true,
      jenisKelamin: true,
      spesialis: true,
      alamat: true,
      nomorTelepon: true,
    },
  });
  console.log("Akun object:", dokter);
  return dokter;
};

const findAllPemeriksaanByIdPelayanan = async (nip) => {
  // Cari informasi admin pelayanan berdasarkan NIP
  const admin = await prismaClient.adminPelayanan.findFirst({
    where: {
      nip: nip,
    },
    select: {
      idPelayananKesehatan: true,
    },
  });

  if (!admin) {
    throw new Error("Admin Pelayanan tidak ditemukan.");
  }

  // Ambil data pemeriksaan beserta pasien dan dokter terkait
  const pemeriksaan = await prismaClient.pemeriksaan.findMany({
    where: {
      dokter: {
        idPelayananKesehatan: admin.idPelayananKesehatan,
      },
    },
    select: {
      tanggal: true,
      selesai: true,
      pasien: {
        select: {
          nik: true,
          nama: true,
          nomorTelepon: true,
        },
      },
      dokter: {
        select: {
          nip: true,
          nama: true,
          spesialis: true,
        },
      },
    },
  });

  // Gabungkan data menjadi satu array objek yang rata
  const result = pemeriksaan.map((item) => ({
    tanggal: item.tanggal,
    selesai: item.selesai,
    nikPasien: item.pasien?.nik || null,
    namaPasien: item.pasien?.nama || null,
    nomorTeleponPasien: item.pasien?.nomorTelepon || null,
    nipDokter: item.dokter?.nip || null,
    namaDokter: item.dokter?.nama || null,
    spesialisDokter: item.dokter?.spesialis || null,
  }));

  console.log("Data Pemeriksaan Terstruktur:", result);
  return result;
};

const findAllPemeriksaanByNIPDokter = async (nip) => {
  // Cari informasi dokter berdasarkan NIP
  const dokter = await prismaClient.dokter.findFirst({
    where: {
      nip: nip,
    },
    select: {
      idPelayananKesehatan: true,
    },
  });

  if (!dokter) {
    throw new Error("Dokter tidak ditemukan.");
  }

  // Ambil data pemeriksaan berdasarkan NIP dokter yang login
  const pemeriksaan = await prismaClient.pemeriksaan.findMany({
    where: {
      nipDokter: nip,  // Menyesuaikan dengan NIP dokter yang login
    },
    select: {
      tanggal: true,
      selesai: true,
      pasien: {
        select: {
          nik: true,
          nama: true,
          nomorTelepon: true,
        },
      },
      dokter: {
        select: {
          nip: true,
          nama: true,
          spesialis: true,
        },
      },
    },
  });

  // Gabungkan data menjadi satu array objek yang rata
  const result = pemeriksaan.map((item) => ({
    tanggal: item.tanggal,
    selesai: item.selesai,
    nikPasien: item.pasien?.nik || null,
    namaPasien: item.pasien?.nama || null,
    nomorTeleponPasien: item.pasien?.nomorTelepon || null,
    nipDokter: item.dokter?.nip || null,
    namaDokter: item.dokter?.nama || null,
    spesialisDokter: item.dokter?.spesialis || null,
  }));

  console.log("Data Pemeriksaan Terstruktur:", result);
  return result;
};




const findAllPasien = async () => {
  // Hanya ambil akun dengan wallet = false
  const pasien = await prismaClient.pasien.findMany({
    select: {
      nik: true,
      noRM: true,
      nama: true,
      jenisKelamin: true,
      tempatLahir: true,
      tanggalLahir: true,
      alamat: true,
      agama: true,
      golonganDarah: true,
      pekerjaan: true,
      kewarganegaraan: true,
      nomorTelepon: true,
      idPelayananKesehatan: true,
    },
  });
  console.log("Akun object:", pasien);
  return pasien;
};


const findAll = async (request) => {
  const userType = util.getAttributeName(request.userType).tableName;
  const users = await prismaClient[userType].findMany({
    select: {
      id: true,
      idAkun: true,
      nama: true,
      alamat: true,
      wallet: true
    },
    where: {
      NOT: [{ nama: 'Pabrik Kelapa Sawit Admin' }, { nama: 'Koperasi Admin' }, { nama: 'Petani Admin' }],
    },
  });

  if (users.length === 0) {
    throw new ResponseError(404, 'Data pengguna tidak ditemukan');
  }

  return users;
};

const addPemeriksaan = async (request) => {
  try {
    console.log('data', request)
    const data = await prismaClient.pemeriksaan.create({
      data: {
        nikPasien: request.nikPasien,
        nipDokter: request.nipDokter,
        tanggal: request.tanggal,
        selesai: request.selesai || "BelumSelesai",
      },
    });
    return data;
  } catch (error) {
    console.error("Error adding pemeriksaan:", error);
    throw error; // Lempar error untuk penanganan lebih lanjut
  }
};


const getPemeriksaan = async () => {
  const data = await prismaClient.pemeriksaan.findMany({
    include: {
      pasien: true,  
      dokter: true,  
    }
  });

  return data;
};

const updateStatusPemeriksaan = async (NIK_Pasien, NIP_Dokter) => {
  const pemeriksaan = await prismaClient.pemeriksaan.findFirst({
    where: {
      nikPasien: NIK_Pasien,
      nipDokter: NIP_Dokter,
      selesai: 'BelumSelesai', 
    },
  });

  if (!pemeriksaan) {
    throw new ResponseError(404, 'Pemeriksaan tidak ditemukan atau sudah selesai');
  }

  // Update status Pemeriksaan menjadi "Selesai"
  const updatedPemeriksaan = await prismaClient.pemeriksaan.update({
    where: {
      id: pemeriksaan.id,
    },
    data: {
      selesai: 'Selesai', 
    },
  });

  return updatedPemeriksaan;
};




const findOneUser = async (request) => {
  const userType = util.getAttributeName(request.userType).tableName;
  console.log('userType', userType);
  const user = await prismaClient[userType].findFirst({
    where: {
      email: request.email,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'Data pengguna tidak ditemukan');
  }

  const { id, password, ...userWithoutIdPassword } = user;

  return {
    ...userWithoutIdPassword,
  };
};

const findPelayananKesehatanByUser = async (nip, role) => {
  let data;
  console.log('nip', nip);
  console.log('role', role);

  if (role === "dokter") {
    data = await prismaClient.dokter.findFirst({
      where: { nip: nip },
      select: {
        pelayananKesehatan: {
          select: {
            id: true,
            nama: true, // Nama pelayanan kesehatan
          },
        },
      },
    });
  } else {
    data = await prismaClient.adminPelayanan.findFirst({
      where: { nip: nip },
      select: {
        pelayananKesehatan: {
          select: {
            id: true,
            nama: true, // Nama pelayanan kesehatan
          },
        },
      },
    });
  }

  // Extracting the id and nama of pelayananKesehatan
  const pelayananKesehatan = data?.pelayananKesehatan;
  const result = {
    id: pelayananKesehatan?.id,
    nama: pelayananKesehatan?.nama,
  };

  console.log("Pelayanan Kesehatan:", result);
  return result;
};


const userService = { update, changePassword, updateProfile, findAll, findAllUser, updateStatusWallet, 
  addPemeriksaan, getPemeriksaan, findAllUserWithoutCA, findAllUserByNIK, 
  findPelayananKesehatanByUser, findAllDokterByIdPelayanan, findAllPasien, 
  findAllPemeriksaanByIdPelayanan, findAllPemeriksaanByNIPDokter, updateStatusPemeriksaan };
export default userService;
