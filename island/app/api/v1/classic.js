const Router = require('koa-router')
const classic = require('../../models/classic')
const {Flow} = require('../../models/flow')
const {Art} = require('../../models/art')

const router = new Router({
    prefix:'/v1/classic/'
})
const {PositiveIntegerValidator} = require('../../validators/validator')
const {Auth} = require('../../../middlewares/auth')

router.get('latest', new Auth().m, async (ctx, next)=>{
    const flow = await Flow.findOne({
        order:[
            //倒序查找
            ['index','DESC']
        ]
    })

    const art = await Art.getData(flow.art_id,flow.type)

    //实际序列化的是MODE的dataValues下面
    // art.dataValues.index = flow.index
    art.setDataValue('index',flow.index)
    ctx.body = art
})

module.exports = router