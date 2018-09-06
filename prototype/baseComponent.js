import Ids from '../models/ids'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import gm from 'gm'
import crypto from 'crypto'

const config = require('config-lite')({
  filename: 'default',
  config_dir: 'config',
});

export default class BaseComponent {
  constructor() {
    this.idList = ['student_id', 'restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id'];
  }

  async fetch(url = '', data = {}, type = 'GET', resType = 'JSON') {

  }

  // todo 分页pager格式封装
  success(res, result = 'ok', msg = '请求成功') {
    res.send({
      data: result,
      status: {
        code: config.SUCCESS_CODE,
        message: msg
      }
    })
  }

  fail(res, err = -1, msg = '请求失败') {
    res.send({
      data: err,
      status: {
        code: config.ERROR_CODE,
        message: msg
      }
    })
  }

  _empty (value) {
    return typeof value === 'undefined' || value === '' && value === null
  }

  encryption(password) {
    const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
    return newpassword
  }

  Md5 (password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
  }

  validEmptyField(res, value, tipStr) {
    if (this._empty(value)) {
      this.fail(res, -1, tipStr + '不能为空')
      return false
    }
    return true
  }

  //获取id列表
  async getId(type) {
    if (!this.idList.includes(type)) {
      console.log('id类型错误');
      throw new Error('id类型错误');
      return
    }
    try {
      const idData = await Ids.findOne();
      idData[type]++;
      await idData.save();
      return idData[type]
    } catch (err) {
      console.log('获取ID数据失败');
      throw new Error(err)
    }
  }

  async getPath(req) {
    return new Promise((resolve, reject) => {
      const form = formidable.IncomingForm();
      form.uploadDir = './public/img';
      form.parse(req, async (err, fields, files) => {
        let img_id;
        try {
          img_id = await this.getId('img_id');
        } catch (err) {
          reject('获取图片id失败')
        }
        const imgName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
        const fullName = imgName + path.extname(files.file.name);
        const repath = './public/img/' + fullName;
        try {
          await fs.rename(files.file.path, repath)
          gm(repath)
          // .resize(600, 600, "!")
          // .crop(200, 200, 50, 50)
            .write(repath, async (res) => {
              console.log(res)
              resolve(fullName)
            })
          // const result = await fs.rename(files.file.path, repath)
          // resolve(fullName)
        } catch (err) {
          console.log('保存图片失败', err)
          fs.unlink(files.file.path)
          reject('保存图片失败')
        }
      })
    })
  }
}