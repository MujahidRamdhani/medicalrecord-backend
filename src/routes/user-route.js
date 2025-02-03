import express from 'express';
import util from '../utils/util.js';
import userController from '../controllers/user-controller.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';

const adminsistem = util.getAttributeName('adminsistem').databaseRoleName;
const adminpelayanan = util.getAttributeName('adminpelayanan').databaseRoleName;
const dokter = util.getAttributeName('dokter').databaseRoleName;
const pasien = util.getAttributeName('pasien').databaseRoleName;

const router = express.Router();

router.get('/api/users/:nip/:role', userController.findPelayananKesehatanByUser);

router.use(authMiddleware);

router.get('/api/users/findAllUsers', authRoleMiddleware([ adminsistem, pasien, dokter, adminpelayanan]), userController.findAllUser);
router.get('/api/users/findAllPasien', authRoleMiddleware([ adminpelayanan]), userController.findAllPasien);
router.put('/api/users/findAllUsersByNIK/:NIK', authRoleMiddleware([ adminsistem, dokter, pasien]), userController.findAllUserByNIK);
router.get('/api/users/findAllDokterByIdPelayanan', userController.findAllDokterByIdPelayanan);
router.get('/api/users/findAllPemeriksaanByIdPelayanan', authRoleMiddleware([ adminpelayanan]), userController.findAllPemeriksaanByIdPelayanan);
router.get('/api/users/findAllPemeriksaanByNIPDokter', authRoleMiddleware([ dokter]), userController.findAllPemeriksaanByNIPDokter);
router.get('/api/users/findAllUsersWithoutCA', authRoleMiddleware([ adminsistem]), userController.findAllUserWithoutCA);

router.post('/api/users/addPemeriksaan', authRoleMiddleware([ adminpelayanan]), userController.addPemeriksaan);
router.get('/api/users/getPemeriksaan', authRoleMiddleware([ adminpelayanan]), userController.getPemeriksaan);

router.put('/api/users/changePassword', authRoleMiddleware([ adminsistem, dokter, pasien, adminpelayanan]), userController.changePassword);
router.put('/api/users/updateProfile', authRoleMiddleware([ adminsistem, dokter, pasien, adminpelayanan]), userController.updateProfile);

export default router;
