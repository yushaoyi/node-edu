'use strict'

import mongoose from 'mongoose';
// import config from 'config-lite';
import chalk from 'chalk';
const config = require('config-lite')({
    filename: 'default',
    // config_basedir: __dirname,
    config_dir: 'config',
});

mongoose.connect(config.url, (err) => {
    if (err) {
        console.log('连接失败')
    } else {
        console.log('连接成功')
    }
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
    console.log(
        chalk.green('连接数据库成功！')
    )
})

db.on('error', (err) => {
    console.error(
        chalk.red('Error in MongoDb connection: ' + err)
    )
    mongoose.disconnect();
})

db.on('close', () => {
    console.log(
        chalk.red('数据库断开，重新连接数据库')
    )
    mongoose.connect(config.url, { server: { auto_reconnect: true } })
})

export default db;