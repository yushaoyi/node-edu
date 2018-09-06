import express from 'express';
import Check from '../middlewares/check';
import Course
const router = express.Router();

//课程列表
router.get('', Check.checkLogin)