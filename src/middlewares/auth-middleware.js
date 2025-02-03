import status from 'http-status';
import prismaClient from '../applications/database.js';
import util from '../utils/util.js';

const authMiddleware = async (req, res, next) => {
  const userEmail = req.session.userEmail;

  if (!userEmail) {
    return res
      .status(status.UNAUTHORIZED)
      .json({
        status: `${status.UNAUTHORIZED} ${status[status.UNAUTHORIZED]}`,
      })
      .end();
  }

  console.log('userEmail', userEmail)

  let akun;
  try {
    akun = await prismaClient.akun.findFirst({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    console.log('akun', akun)
  } catch (error) {
    console.log('error', error)
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({
        status: `${status.INTERNAL_SERVER_ERROR} ${status[status.INTERNAL_SERVER_ERROR]}`,
        message: 'Database query failed',
      })
      .end();
  }

  if (!akun) {
    return res
      .status(status.UNAUTHORIZED)
      .json({
        status: `${status.UNAUTHORIZED} ${status[status.UNAUTHORIZED]}`,
      })
      .end();
  }

  const { tableName, roleName } = util.getAttributeName(akun.role);
  console.log('role', roleName)

  let user;
  try {
    if(roleName == "adminsistem"){
      user = await prismaClient.adminSistem.findUnique({
        where: {
          idAkun: akun.id,
        },
        // select: {
        //   nama: true,
        //   idAdminSistem: roleName === 'adminsistem' ? true : undefined,
        //   nip_admin_pelayanan: roleName === 'adminpelayanan' ? true : undefined,
        //   nip: roleName === 'dokter' ? true : undefined,
        //   nik: roleName === 'pasien' ? true : undefined,
        // },
      });
      console.log('user ADMIN SISTEM', user)
    } else if(roleName == "adminpelayanan"){
      user = await prismaClient.adminPelayanan.findUnique({
        where: {
          idAkun: akun.id,
        },
        // select: {
        //   nama: true,
        //   idAdminSistem: roleName === 'adminsistem' ? true : undefined,
        //   nip_admin_pelayanan: roleName === 'adminpelayanan' ? true : undefined,
        //   sip: roleName === 'dokter' ? true : undefined,
        //   nik: roleName === 'pasien' ? true : undefined,
        // },
      });
      console.log('user ADMIN PELAYANAN', user)
    }else{
      user = await prismaClient[tableName].findUnique({
        where: {
          idAkun: akun.id,
        },
        // select: {
        //   nama: true,
        //   idAdminSistem: roleName === 'adminsistem' ? true : undefined,
        //   nip_admin_pelayanan: roleName === 'adminpelayanan' ? true : undefined,
        //   sip: roleName === 'dokter' ? true : undefined,
        //   nik: roleName === 'pasien' ? true : undefined,
        // },
      });
    }
    

    req.user = {
      ...akun,
      idRole: roleName === 'adminsistem' ? user.idAdminSistem : roleName === 'adminpelayanan' ? user.nip : roleName === 'dokter' ? user.nip :user.nik,
      nama: user.nama,
    };
  } catch (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({
        status: `${status.INTERNAL_SERVER_ERROR} ${status[status.INTERNAL_SERVER_ERROR]}`,
        message: 'Database query failed',
      })
      .end();
  }

  next();
};


const authRoleMiddleware = (allowedRoles) => async (req, res, next) => {
  const currentUserRole = util.getAttributeName(req.user.role).databaseRoleName;

  if (!allowedRoles.includes(currentUserRole)) {
    return res
      .status(status.UNAUTHORIZED)
      .json({
        status: `${status.UNAUTHORIZED} ${status[status.UNAUTHORIZED]}`,
      })
      .end();
  }

  next();
};

const isLoggedInMiddleware = (req, res, next) => {
  if (req.session.userEmail) {
    return res
      .status(status.FORBIDDEN)
      .json({
        status: `${status.FORBIDDEN} ${status[status.FORBIDDEN]}`,
        message: 'You are already logged in. Please logout first.',
      })
      .end();
  }

  next();
};

export { authMiddleware, authRoleMiddleware, isLoggedInMiddleware };
