import express from 'express';
import util from '../utils/util.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';
import rekamMedisController from '../controllers/rekamMedis-controller.js';

const router = express.Router();

// Retrieve roles from utility functions
//const adminSistem = util.getAttributeName('koperasi').databaseRoleName;
//const adminPelayanan = util.getAttributeName('dinas').databaseRoleName;
const dokter = util.getAttributeName('dokter').databaseRoleName;
const pasien = util.getAttributeName('pasien').databaseRoleName;
//const pasien = util.getAttributeName('pasien').databaseRoleName;

// Apply authentication middleware
router.use(authMiddleware);

router.post('/api/rekamMedis/CreateRekamMedis', authRoleMiddleware([dokter]), rekamMedisController.createRekamMedis);
router.post('/api/rekamMedis/CreateAndUpdateRekamMedis', authRoleMiddleware([dokter]), rekamMedisController.createAndUpdateRekamMedis);
router.get('/api/rekamMedis/GetAllRekamMedisByDokterId', authRoleMiddleware([dokter]), rekamMedisController.getAllRekamMedisByDokterId);
router.put('/api/rekamMedis/UpdateRekamMedis/:No_RM', authRoleMiddleware([dokter]), rekamMedisController.updateRekamMedis);
router.get('/api/rekamMedis/GetAllRekamMedisByDokterIdFilteredHakAksesTrue', authRoleMiddleware([dokter]), rekamMedisController.getAllRekamMedisByDokterIdFilteredHakAksesTrue);
router.put('/api/rekamMedis/HistoryRekamMedis/:No_RM', authRoleMiddleware([dokter]), rekamMedisController.historyRekamMedis);
router.put('/api/rekamMedis/HistoryRekamMedisFilterByPasienNIK/:NIK_Pasien', authRoleMiddleware([pasien]), rekamMedisController.historyRekamMedisFilterByPasienNIK);
router.get('/api/rekamMedis/HistoryRekamMedisFilterByPasienLogin', authRoleMiddleware([pasien]), rekamMedisController.historyRekamMedisFilterByPasienLogin);

export default router;
