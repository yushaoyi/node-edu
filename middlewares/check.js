'use strict'

class Check {
    constructor () {

    }

    async checkLogin (req, res, next) {
        const user_id = req.session.user_id
        console.log('checklogin: ', user_id)
        if (!user_id || !Number(user_id)) {
            // res.send({
            //     status: 0,
            //     type: 'failure',
            //     message: '还未登录'
            // })
            res.sendStatus(401);
            return
        }
        next()
    }
}

export default new Check()