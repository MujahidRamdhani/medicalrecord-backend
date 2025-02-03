import status from 'http-status';
import userService from '../services/user-service.js';
import hakAksesServices from '../services/hakakses-service.js';

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;

    const result = await userService.update(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const user = req.user; // Mengambil data user dari middleware autentikasi
    const { newPassword } = req.body; // Mengambil password baru dari request body

    // Validasi input
    if (!newPassword || newPassword.length < 8) {
      throw new ResponseError(400, 'Password harus minimal 8 karakter');
    }

    // Memanggil service untuk mengganti password
    const result = await userService.changePassword(user.email, newPassword);

    // Merespons dengan status sukses
    res.status(200).json({
      status: '200 OK',
      message: 'Password berhasil diperbarui',
      data: result,
    });
  } catch (error) {
    next(error); // Forward error ke error handler middleware
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user; // Data user dari middleware autentikasi
    const updateData = req.body; // Data yang akan diupdate dari request body

    // Validasi input
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new ResponseError(400, "Data yang akan diperbarui tidak boleh kosong");
    }

    // Panggil service untuk memperbarui profil
    const result = await userService.updateProfile(id, role, updateData);

    // Merespons dengan status sukses
    res.status(200).json({
      status: "200 OK",
      message: "Profil berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    next(error); // Forward error ke middleware error handler
  }
};


const findAll = async (req, res, next) => {
  try {
    const userType = req.query.userType;
    const request = { userType };

    const result = await userService.findAll(request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllUser = async (req, res, next) => {
  try {
    const result = await userService.findAllUser();
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllUserWithoutCA = async (req, res, next) => {
  try {
    const result = await userService.findAllUserWithoutCA();
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllUserByNIK = async (req, res, next) => {
  try {
    const NIK = req.params.NIK;
    const result = await userService.findAllUserByNIK(NIK);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllDokterByIdPelayanan = async (req, res, next) => {
  try {
    const nip = req.user.idRole;
    const result = await userService.findAllDokterByIdPelayanan(nip);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllPemeriksaanByIdPelayanan = async (req, res, next) => {
  try {
    const nip = req.user.idRole;
    const result = await userService.findAllPemeriksaanByIdPelayanan(nip);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllPemeriksaanByNIPDokter = async (req, res, next) => {
  try {
    const nip = req.user.idRole;
    console.log('nipdokter', nip)
    const result = await userService.findAllPemeriksaanByNIPDokter(nip);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllPasien = async (req, res, next) => {
  try {
    const result = await userService.findAllPasien();
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await userService.findOne(user);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addPemeriksaan = async (req, res, next) => {
  try {
    const user = req.user;
    const { body: request } = req;

    const result = await userService.addPemeriksaan(request);
    const resultHakAkses = await hakAksesServices.createHakAksesUser(user, request);
    res.status(status.CREATED).json({
      status: `${status.CREATED} ${status[status.CREATED]}`,
      data: resultHakAkses,
    });
  } catch (error) {
    next(error);
  }
};

const getPemeriksaan = async (req, res, next) => {
  try {
    const result = await userService.getPemeriksaan();
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findPelayananKesehatanByUser = async (req, res) => {
  try {
    const {nip, role} = req.params;

    const result = await userService.findPelayananKesehatanByUser(nip, role);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    return error;
  }
};


const userController = { update, changePassword, updateProfile, findAll, findOne, findAllUser, 
  findAllUserWithoutCA, findAllUserByNIK, addPemeriksaan, getPemeriksaan, 
  findPelayananKesehatanByUser, findAllDokterByIdPelayanan, findAllPasien, findAllPemeriksaanByIdPelayanan,
  findAllPemeriksaanByNIPDokter};
export default userController;
