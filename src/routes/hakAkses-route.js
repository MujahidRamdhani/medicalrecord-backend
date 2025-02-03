import express from 'express';
import util from '../utils/util.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';
import hakAksesController from '../controllers/hakAkses-controller.js';

const router = express.Router();

// Retrieve roles from utility functions
//const adminSistem = util.getAttributeName('koperasi').databaseRoleName;
//const adminPelayanan = util.getAttributeName('dinas').databaseRoleName;
const dokter = util.getAttributeName('dokter').databaseRoleName;
const pasien = util.getAttributeName('pasien').databaseRoleName;
const adminpelayanan = util.getAttributeName('adminpelayanan').databaseRoleName;
//const pasien = util.getAttributeName('pasien').databaseRoleName;

// Apply authentication middleware
router.use(authMiddleware);

router.post('/api/hakAkses/CreateHakAkses', authRoleMiddleware([dokter, adminpelayanan]), hakAksesController.createHakAkses);
router.get('/api/hakAkses/GetAllhakAksesByNIPDokter', authRoleMiddleware([dokter]), hakAksesController.getAllHakAksesByNIPDokter);
router.get('/api/hakAkses/GetAllhakAksesByPasienNIK', authRoleMiddleware([pasien]), hakAksesController.getAllHakAksesByPasienNIK);
router.put('/api/hakAkses/UpdatehakAkses/:Id_Hak_Akses', authRoleMiddleware([pasien]), hakAksesController.updateHakAkses);
router.put('/api/hakAkses/HistoryhakAkses/:Id_Hak_Akses', authRoleMiddleware([dokter, pasien]), hakAksesController.historyHakAkses);

export default router;
