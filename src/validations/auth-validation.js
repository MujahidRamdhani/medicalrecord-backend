import Joi from 'joi';

const registerUserValidation = Joi.object({
  role: Joi.string().valid('adminsistem', 'adminpelayanan', 'dokter', 'pasien').required(),
  nama: Joi.string().max(200).required(),
  alamat: Joi.string().required(),
  nomorTelepon: Joi.string().required(), 
  email: Joi.string().email().max(200).required(), 
  password: Joi.string().max(200).required(),
  nik: Joi.string().max(200),
  jenisKelamin: Joi.string().max(200),
  nip: Joi.string().max(200),
  kodePelayanan: Joi.string().max(200),
  namaPelayanan: Joi.string().max(200),
  tipePelayanan: Joi.string().max(200),
  alamatPelayanan: Joi.string().max(200),
  nomorTeleponPelayanan: Joi.string().max(200),
  idPelayananKesehatan: Joi.string().max(200),
  spesialis: Joi.string().max(200),
  tempatLahir: Joi.string().max(200),
  tanggalLahir: Joi.string().max(200),
  noRM: Joi.string().max(200),
  agama: Joi.string().max(200),
  golonganDarah: Joi.string().max(200),
  pekerjaan: Joi.string().max(200),
  kewarganegaraan: Joi.string().max(200),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().max(200).required(),
  password: Joi.string().max(200).required(),
});

const meValidation = Joi.string().email().max(200).required();

export { registerUserValidation, loginUserValidation, meValidation };
