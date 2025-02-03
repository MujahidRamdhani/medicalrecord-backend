import express from 'express';
import path from 'path';

import util from '../utils/util.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';
import invokeController from '../controllers/invoke-controller.js';


const adminSistem = util.getAttributeName('adminsistem').databaseRoleName;
const adminPelayanan = util.getAttributeName('adminpelayanan').databaseRoleName;
const dokter = util.getAttributeName('dokter').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);
router.post('/api/users/InvokeCaAdmin', authRoleMiddleware([ adminSistem]), invokeController.caRegisterAdmin );
router.post('/api/users/InvokeCaUser', authRoleMiddleware([ adminSistem, adminPelayanan ]), invokeController.caRegisterUser );

export default router;
