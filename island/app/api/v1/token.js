const Router = require('koa-router')
const {TokenValidator} = require('../../validators/validator')
const {success} = require('../../lib/helper')
const {LoginType} = require('../../lib/enum')
const {User} = require('../../models/user')
const {generateToken} = require('../../../core/util')
const router = new Router({
    prefix:'/v1/token'
})

router.post('/', async (ctx)=>{
    const v = await new TokenValidator().validate(ctx)
    let token
    switch (v.get('body.type')) {
            //邮箱
        case LoginType.USER_EMAIL:
            token = await emailLogin(v.get('body.account'),v.get('body.secret'))
            break;
            //小程序
        case LoginType.USER_MINI_PROGRAM:
                
                break;
        default:
            throw new global.errs.ParameterException('没有相应的处理函数')
            break;
    }
    ctx.body = {
        token
    }
    // success()
})

async function emailLogin(account,secret){
   const user = await User.verifyEmailPassword(account,secret)
   return generateToken(user.id,2)
}
module.exports = router