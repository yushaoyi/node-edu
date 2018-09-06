'use strict';
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import CourseModel from '../../models/course/course'

const queryStr = 'id name phone create_at update_at create_date update_date status sex -_id'

class Course extends BaseComponent {
  constructor() {
    super()
    this.getCourseList = this.getCourseList.bind(this)
  }

  /**
   * 分页查询课程列表（可过滤只返回部分字段）
   * @param req
   * @param res
   * @param next
   * @returns {Promise.<void>}
   */
  async getCourseList (req, res, next) {
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
        const count = await CourseModel.count()
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
          const users = await CourseModel.find(filter, queryStr)
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
        data = await CourseModel.find(filter, queryStr)
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

}

export default new Course()