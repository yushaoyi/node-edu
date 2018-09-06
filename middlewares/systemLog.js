'use strict';

import SysLogsModel from '../models/sysLogs/sysLogs'
import dtime from 'time-formater'
import BaseComponent from "../prototype/baseComponent";


class SystemLog extends BaseComponent {
    constructor () {
        super()
        this.apiRecord = this.apiRecord.bind(this)
    }

    async apiRecord (req, res, next) {
        let send = res.send
        let content = ''
        let query = req.query || {}
        let body = req.body || {}
        res.send = function () {
            content = arguments[0]
            send.apply(res, arguments)
        }

        await next()
        try {
            // console.log(req)
            // console.log(req.headers)
            const log_id = await this.getId('statis_id')
            let origin = req.headers.host || req.headers.origin
            let method = req.method
            let input_params = method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.params)
            const apiInfo = {
                id: log_id,
                date_time: dtime().format('YYYY-MM-DD hh:mm:ss'),
                origin: origin,
                url: origin + req.url,
                method: req.method,
                input_params: input_params,
                return_value: JSON.stringify(content),
                create_by: req.session ? req.session.user_id : '',
                create_date: dtime().format('YYYY-MM-DD hh:mm:ss')
            }

            res.on("finish", function(response){

            });
            // SysLogsModel.create(apiInfo)

        } catch (err) {
            console.log('API 记录出错', err)
        }

    }
}

export default new SystemLog()