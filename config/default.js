'use strict';

module.exports = {
  port: 10000,
  url: 'mongodb://localhost:20086',
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
