'use strict';

import express from 'express';
import Student from '../controller/student/students'
import Check from '../middlewares/check';

const router = express.Router()

// 学生登录
router.post('/login', Student.login);
// 学生注册
router.post('/register', Student.register);

// 查询学生列表
router.get('', Check.checkLogin, Student.getAllStudents);

// 添加学生
router.post('', Check.checkLogin, Student.addStudent);

// 修改学生
router.put('/:student_id', Check.checkLogin, Student.modifyStudent);
//
// // 删除学生
router.delete('/:student_id', Check.checkLogin, Student.deleteStudent);

// 验证手机号是否存在
router.get('/checkPhone', Check.checkLogin, Student.checkPhone);

export default router;