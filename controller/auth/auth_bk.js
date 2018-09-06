'use strict';
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import AuthModel from '../../models/auth/auth'

class Auth extends BaseComponent {
    constructor() {
        super()
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.getAllUsers = this.getAllUsers.bind(this)
        this.uploadImg = this.uploadImg.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
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

            const { password, phone } = fields;
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
                const admin = await AuthModel.findOne({phone});
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
        // res.send({
        //     status: 0,
        //     type: 'success',
        //     message: '登录成功'
        // })
    }

    // async register (req, res, next) {
    //
    //     const form = new formidable.IncomingForm();
    //     form.parse(req, async (err, fields, files) => {
    //         if (err) {
    //             res.send({
    //                 status: 0,
    //                 type: 'success',
    //                 message: '参数错误'
    //             })
    //             return
    //         }
    //         console.log(req, '******')
    //         const { userName, password, phone } = fields
    //         if (!userName || !password || !phone) {
    //           res.send({
    //             status: 0,
    //             type: 'success',
    //             message: '参数错误'
    //           })
    //           return
    //         }
    //         try {
    //             const auth = await AuthModel.findOne({ phone });
    //             if (auth) {
    //                 res.send({
    //                     status: 0,
    //                     type: 'success',
    //                     message: '该用户已存在'
    //                 })
    //             } else {
    //                 const user_id = await this.getId('admin_id')
    //                 const newUser = {
    //                     user_name: userName,
    //                     password: password,
    //                     id:  user_id,
    //                     phone: phone
    //                 }
    //
    //                 await AuthModel.create(newUser)
    //                 res.send({
    //                     status: 0,
    //                     message: '注册成功！'
    //                 })
    //             }
    //         } catch (err) {
    //             res.send({
    //                 status: 0,
    //                 type: 'failure',
    //                 message: '注册失败'
    //             })
    //         }
    //     })
    // }

  async register (req, res, next) {

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
      const auth = await AuthModel.findOne({ phone });
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

        await AuthModel.create(newUser)
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

    async changePassword(req, res, next) {
        const user_id = req.params.user_id;
        console.log(req.params)
        if (!user_id || !Number(user_id)) {
            res.send({
                status: 1,
                type: 'failure',
                message: 'id参数错误'
            })
            return
        }

        try {
            const { newPassword, oldPassword} = req.params;
            const user = AuthModel.findOne({user_id})
            if (!user) {
                throw new Error('找不到用户')
            } else if (user.password != oldPassword){
                throw new Error('原密码不正确')
            } else {
                const result = await AuthModel.findOneAndUpdate({id: user_id}, {password: newPassword})
                res.send({
                    status: 0,
                    type: 'success',
                    message: '密码修改成功'
                })
            }

        } catch (err) {
            res.send({
                status: 0,
                type: 'failure',
                message: err.message
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
    async getAllUsers (req, res, next) {
        const { pageIndex = 1, pageSize = 3 } = req.query;
        try {
            let filter = {

            }
            const users = await AuthModel.find(filter, 'id user_name phone create_date status sex -_id')
                .sort({create_date: 1})
                .limit(Number(pageSize))
                .skip(Number((pageIndex - 1) * pageSize));
            this.success(res, users)
            // res.send(users);
        } catch (err) {
            this.fail(res, err, '获取失败')
            // res.send({
            //     status: 1,
            //     type: "failure",
            //     message: '获取失败'
            // })
        }
    }

    async getUserCount (req, res, next) {
        try {
            const count = await AuthModel.count()
            res.send({
                status: 0,
                count: count
            })
        } catch (err) {
            res.send({
                status: 1,
                type: 'failure',
                message: '获取数量失败'
            })
        }
    }

    async uploadImg (req, res, next) {
        try {
            const image_path = await this.getPath(req);
            res.send({
                status: 0,
                path: image_path
            })
        } catch (err) {
            console.log(err)
            res.send({
                status: 1,
                type: 'failure',
                message: '上传图片失败'
            })
        }
    }

    // async deleteUser (req, res, next) {
    //     const user_id = req.params.user_id;
    //     if (!user_id || !Number(user_id)) {
    //         res.send({
    //             status: 1,
    //             type: 'failure',
    //             message: '缺少user_id'
    //         })
    //     }
    //     try {
    //         console.log(user_id)
    //         const result = await AuthModel.remove({id: user_id}, err => {
    //             console.log(err)
    //         })
    //         console.log(result)
    //         if (result && result.n !== 0) {
    //             res.send({
    //                 status: 0,
    //                 type: 'success',
    //                 message: '删除成功！'
    //             })
    //         } else {
    //             res.send({
    //                 status: 1,
    //                 type: 'failure',
    //                 message: '删除失败！'
    //             })
    //         }
    //     } catch (err) {
    //         res.send({
    //             status: 1,
    //             type: 'failure',
    //             message: '删除失败'
    //         })
    //     }
    // }

    async deleteUser (req, res, next) {
        const user_id = req.params.user_id;
        if (!user_id || !Number(user_id)) {
            res.send({
                status: 1,
                type: 'failure',
                message: '缺少user_id'
            })
        }
        try {
            console.log(user_id)
            const result = await AuthModel.findOneAndRemove({id: user_id})
            console.log(result)
            if (!result) {
                res.send({
                    status: 1,
                    type: 'failure',
                    message: '删除失败'
                })
                return
            }
            res.send({
                status: 0,
                type: 'success',
                message: '删除成功！'
            })
        } catch (err) {
            res.send({
                status: 1,
                type: 'failure',
                message: '删除失败'
            })
        }
    }

}

export default new Auth()