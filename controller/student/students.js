'use strict';
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import StudentModel from '../../models/student/students'
import AdminModel from "../../models/admin/admin";

const queryStr = 'id name phone create_at update_at create_date update_date status sex -_id'

class Student extends BaseComponent {
  constructor() {
    super()
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    this.getAllStudents = this.getAllStudents.bind(this)
    this.addStudent = this.addStudent.bind(this)
    this.modifyStudent = this.modifyStudent.bind(this)
    this.deleteStudent = this.deleteStudent.bind(this)
    this.checkPhone = this.checkPhone.bind(this)
  }

  async login (req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.send({
          status: 1,
          type: 'failure',
          message: '参数错误'
        })
        return
      }

      const {password, phone} = fields;
      console.log(phone, password)
      try {
        if (!phone) {
          throw new Error('电话不能为空')
        } else if (!password) {
          throw new Error('密码不能为空')
        }

        if (!/^1\d{10}$/.test(phone)) {
          throw new Error('电话格式不正确')
        }
      } catch (err) {
        res.send({
          status: 1,
          type: 'failure',
          message: err.message
        })
        return
      }

      try {
        const admin = await StudentModel.findOne({phone});
        // const admin = await AuthModel.find({phone}, '-_id');
        console.log(admin)
        if (!admin) {
          res.send({
            status: 1,
            type: 'failure',
            message: '用户不存在'
          })
        } else if (password != admin.password.toString()) {
          res.send({
            status: 1,
            type: 'failure',
            message: '密码错误'
          })
        } else {
          console.log(admin)
          req.session.user_id = admin.id;
          res.send({
            status: 0,
            type: 'success',
            message: '登录成功'
          })
        }
      } catch (err) {
        res.send({
          status: 0,
          type: 'failure',
          message: "登录失败"
        })
      }
    })
  }

  async register (req, res, next) {
    console.log('register')
    try {
      const { userName, password, phone } = req.body
      if (!userName || !password || !phone) {
        res.send({
          status: 0,
          type: 'success',
          message: '参数错误'
        })
        return
      }
      const auth = await StudentModel.findOne({ phone });
      if (auth) {
        res.send({
          status: 0,
          type: 'success',
          message: '该用户已存在'
        })
      } else {
        const user_id = await this.getId('admin_id')
        const newUser = {
          user_name: userName,
          password: password,
          id:  user_id,
          phone: phone
        }

        await StudentModel.create(newUser)
        res.send({
          status: 0,
          message: '注册成功！'
        })
      }
    } catch (err) {
      res.send({
        status: 0,
        type: 'failure',
        message: '注册失败'
      })
    }
  }

  /**
   * 分页查询注册的用户（可过滤只返回部分字段）
   * @param req
   * @param res
   * @param next
   * @returns {Promise.<void>}
   */
  async getAllStudents (req, res, next) {
    const { pageIndex, pageSize = 10, name } = req.query;
    try {
      let filter = {

      }
      if (!this._empty(name)) {
        filter.name = name;
      }
      let data = []
      if (!this._empty(pageIndex) && Number(pageIndex)) {
        // 分页查询
        const count = await StudentModel.count()
        console.log(count)
        const maxPage = Math.ceil(count / (Number(pageSize)));
        if (Number(pageIndex) > maxPage) {
          data = {
            list: [],
            total: count,
            currentPage: Number(pageIndex),
            pageSize: Number(pageSize)
          }
        } else {
          const users = await StudentModel.find(filter, queryStr)
            .sort({create_date: -1})
            .limit(Number(pageSize))
            .skip(Number((pageIndex - 1) * pageSize));
          data = {
            list: users,
            total: count,
            currentPage: Number(pageIndex),
            pageSize: Number(pageSize)
          }
        }

      } else {
        data = await StudentModel.find(filter, queryStr)
          .sort({create_date: -1})
      }
      this.success(res, data)
    } catch (err) {
      this.fail(res, err, '获取失败')
    }
  }

  async addStudent (req, res, next) {
    try {
      const { name, phone, sex } = req.body
      console.log(name, phone, sex)
      if(!this.validEmptyField(res, name, '姓名') ||
        !this.validEmptyField(res, phone, '手机号')) {
        return
      }
      const auth = await StudentModel.findOne({ phone });
      if (auth) {
        this.fail(res, '', '该学生已存在');
      } else {
        const student_id = await this.getId('student_id')
        console.log(student_id)
        const newUser = {
          name: name,
          password: this.Md5('123456'),
          id:  student_id,
          phone: phone,
          sex: sex
        }

        await StudentModel.create(newUser)
        this.success(res, '', '添加成功')
      }
    } catch (err) {
      this.fail(res, '', '添加失败');
    }
  }

  async modifyStudent (req, res, next) {
    try {
      const student_id = req.params.student_id;
      if (!student_id || !Number(student_id)) {
        this.fail(res, '', 'id参数错误')
        return
      }
      const student = StudentModel.findOne({student_id: student_id});
      if (!student) {
        throw new Error('找不到用户')
      } else {
        const { name, phone, sex } = req.body
        const result = await StudentModel.findOneAndUpdate({id: student_id}, {
          name: name,
          phone: phone,
          sex: sex,
        }, {
          projection: queryStr,
          returnNewDocument: true,
          new: true
        });
        console.log(result)
        this.success(res, result, '修改成功')
      }
    } catch (err) {
      console.log(err);
      this.fail(res, err, '修改失败');
    }
  }

  async deleteStudent (req, res, next) {
      const student_id = req.params.student_id;
      if (!student_id || !Number(student_id)) {
          res.send({
              status: 1,
              type: 'failure',
              message: '缺少student_id'
          })
      }
      try {
          const result = await StudentModel.remove({id: student_id})
          if (result && result.n > 0) {
            this.success(res, '', '删除成功')
          } else {
            this.fail(res, '', '删除失败')
          }
      } catch (err) {
        this.fail(res, '', '删除失败')
      }
  }


  async checkPhone (req, res, next) {
    const { phone } = req.query
    if (!phone) {
      this.fail(res, '', '手机号不能为空')
      return
    }
    const student = await StudentModel.findOne({ phone });
    console.log(student)
    if (student) {
      this.fail(res, '', '手机号已存在');
    } else {
      this.success(res, 'ok', '手机号可正常使用')
    }
  }

}

export default new Student()