const express = require('express')
import router from './routes/index.js';
import db from './mongodb/db.js';
import connectMongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';
import SystemLog from './middlewares/systemLog';
import bodyParser from 'body-parser';
import chalk from 'chalk';
const config = require('config-lite')({
    filename: 'default',
    config_dir: 'config',
});

const app = express()
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(SystemLog.apiRecord)

app.use(express.static(path.join(__dirname, 'public')))

const MongoStore = connectMongo(session);

app.use(cookieParser());

app.use(session({
    name: config.session.name,  // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: config.session.cookie,
    store: new MongoStore({ // 将 session 存储到 mongodb
        url: config.url // mongodb 地址
    })
}));

// 正常请求的日志
// app.use(expressWinston.logger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.File({
//             filename: 'logs/success.log'
//         })
//     ],
//     requestWhitelist: ["body"], // Array of request properties to log. Overrides global requestWhitelist for this instance
//     responseWhitelist: ["body"], //
// }))
// 路由
router(app)
// 错误请求的日志
// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.File({
//             filename: 'logs/error.log'
//         })
//     ]
// }));


app.listen(config.port);
// console.log(
//   chalk.green('server started at ' + `http://localhost:${config.port}`)
// )