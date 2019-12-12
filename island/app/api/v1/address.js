const Router = require('koa-router')
const {Address} = require('@models/address')
const {PhoneNumValidator} = require('@validators/validator')
const {Auth} = require('@middlewares/auth')
const {success} = require('../../lib/helper')

const router = new Router({
    prefix:'/v1/address/'
})

// 获取地址列表
router.get('get_address_list', new Auth().m, async (ctx, next)=>{

    const addressList = await Address.getAllAddress(ctx.auth.uid)

    // art.exclude = ['index','like_status']
    ctx.body = addressList
})

// 新增地址接口
router.post('add_address', new Auth().m, async (ctx, next)=>{

    const v = await new PhoneNumValidator().validate(ctx,)
    const address = await Address.addAddress(
        v.get('body.name'),
        v.get('body.phone'),
        v.get('body.detailAddress'),
        v.get('body.receiveAddress'),
        ctx.auth.uid)
  
    // art.exclude = ['index','like_status']
    ctx.body = address
})

// 删除地址信息
router.post('del_address', new Auth().m, async (ctx, next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx)
    await Address.delAddress(
        v.get('body.id'),
        ctx.auth.uid)
  
    // art.exclude = ['index','like_status']
    success()
})

// 设置默认地址信息
router.post('set_default_address', new Auth().m, async (ctx, next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx)
    await Address.setDefaultAddress(
        v.get('body.isDefault'),
        v.get('body.id'),
        ctx.auth.uid)
  
    // art.exclude = ['index','like_status']
    success()
})

// 获取默认地址信息
router.get('get_default_address', new Auth().m, async (ctx, next)=>{

    const address = await Address.getDefaultAddress(ctx.auth.uid)

    // art.exclude = ['index','like_status']
    ctx.body = address
})

// 更新地址信息
router.post('update_address', new Auth().m, async (ctx, next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx)
    await Address.updateAddress(
        v.get('body.name'),
        v.get('body.phone'),
        v.get('body.detail_address'),
        v.get('body.receive_address'),
        v.get('body.id'),
        ctx.auth.uid)
  
    // art.exclude = ['index','like_status']
    success()
})

module.exports = router