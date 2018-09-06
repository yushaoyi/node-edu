import BaseComponent from "../../prototype/baseComponent";
import AdminModel from '../../models/admin/admin'

class Admin extends BaseComponent {

  constructor () {
    super()
    this.login = this.login.bind(this);
    this.signout = this.signout.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.addAdminUser = this.addAdminUser.bind(this);
    this.changeAdminStatus = this.changeAdminStatus.bind(this);
    this.modifyRole = this.modifyRole.bind(this);
  }

  async login (req, res, next) {

      const {userName: user_name, password} = req.body

      try {
        if (!user_name) {
          throw new Error('登录账号不能为空')
        } else if (!password) {
          throw new Error('密码不能为空')
        }

      } catch (err) {
        this.fail(res, '', err.message)
        return
      }

      try {
        const admin = await AdminModel.findOne({user_name}, '-_id', function (err, obj) {
          console.log(err)
        });
        // const admin = await AuthModel.find({phone}, '-_id');
        if (!admin) {
          this.fail(res, '', '用户不存在');
        } else if (this.Md5(password) != admin.password.toString()) {
          this.fail(res, '', '密码不正确');
        } else {
          req.session.user_id = admin.id;
          const adminObj = { ...admin._doc }
          delete adminObj.password
          this.success(res, adminObj, '登录成功');
          // delete admin._doc.password
          // req.session.user_id = admin.id;
          // this.success(res, admin, '登录成功');
        }
      } catch (err) {
        this.fail(res, '', '登录失败');
      }
  }

  async signout (req, res, next) {
    try {
      delete req.session.admin_id;
      this.success(res, '', '退出成功')
    } catch (err) {
      this.fail(res, '', '退出失败')
    }
  }

  async changePassword (req, res, next) {

  }

  async addAdminUser (req, res, next) {
    try {
      console.log('addAdminUser')
      const { userName: user_name, position = '', department = '' } = req.body
      if (!user_name) {
        res.send({
          status: 0,
          type: 'success',
          message: '用户名不能为空'
        })
        return
      }
      const user = await AdminModel.findOne({ user_name });
      console.log(user)
      if (user) {
        this.fail(res, '', '该用户已存在');
      } else {
        const admin_id = await this.getId('admin_id')
        const newUser = {
          user_name: user_name,
          password: this.Md5('123456'),
          position: position,
          department: department,
          id: admin_id
        }

        let result = await AdminModel.create(newUser);
        this.success(res, result, '添加成功')
      }
    } catch (err) {
      this.fail(res, err, '添加失败')
    }
  }

  async changeAdminStatus (req, res, next) {

  }

  async modifyRole (req, res, next) {

  }
}

export default new Admin()