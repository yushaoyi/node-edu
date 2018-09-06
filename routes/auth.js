'use strict';

import express from 'express'
import Auth from '../controller/auth/auth'
import Check from '../middlewares/check'
const router = express.Router()

router.get('/login', function (req, res) {
    res.send('hello, login')
});

// 学生登录
router.post('/login', Auth.login);
// 学生注册
router.post('/register', Auth.register);

//修改管理员密码
router.post('/admin/:id/changePwd', Check.checkLogin, Auth.changePassword);

router.post('/uploadImg', Auth.uploadImg)

router.get("*",function(req,res){
    res.send("404!");
});


export default router