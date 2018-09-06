'use strict';

import express from 'express'
import Admin from '../controller/admin/admin'
import Check from '../middlewares/check'

const router = express.Router();

router.post('/login', Admin.login);

router.post('/signout', Admin.signout);

router.post('/changePassword', Check.checkLogin, Admin.changePassword);

router.post('', Check.checkLogin, Admin.addAdminUser)

router.put('/:id/:status',  Check.checkLogin, Admin.changeAdminStatus)

router.put('/:id/role', Check.checkLogin, Admin.modifyRole)

export default router;