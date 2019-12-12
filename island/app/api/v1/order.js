const Router = require('koa-router')
const { Order} = require('@models/order')
const {AddGroupValidator,PositiveIntegerValidator} = require('@validators/validator')
const {Auth} = require('@middlewares/auth')
const {success} = require('../../lib/helper')

const router = new Router({
    prefix:'/v1/order/'
})

// 新增团购信息
router.post('new_order', new Auth().m, async (ctx, next)=>{

    const v = await new PositiveIntegerValidator().validate(ctx,{
        id:'group_id'
    })
 
    const order = await Order.newOrder(
        v.get('body.group_id'),
        v.get('body.address_id'),
        v.get('body.group_way'),
        v.get('body.distribution_type'),
        v.get('body.contact_name'),
        v.get('body.contact_phone'),
        v.get('body.address'),
        v.get('body.remark'),
        v.get('body.goods'),ctx.auth.uid)
    
    ctx.body = order
    
})

// 新增团购信息
router.get('get_group', new Auth().m, async (ctx, next)=>{

    const v = await new PositiveIntegerValidator().validate(ctx)

    const group = await Group.getGroup(v.get('query.id'),ctx.auth.uid)
    
    ctx.body = group
    
})

module.exports = router