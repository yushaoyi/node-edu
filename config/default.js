'use strict';

module.exports = {
  port: 10000,
  url: 'mongodb://xigua2:84986987@140.143.228.82:20086/test',
  session: {
    name: 'SID',
    secret: 'SID',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000 // 过期时间，过期后 cookie 中的 session id 自动删除
    }
  },
  SUCCESS_CODE: 0,
  ERROR_CODE: 1
}