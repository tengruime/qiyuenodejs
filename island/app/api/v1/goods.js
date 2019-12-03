const Router = require('koa-router')
const {Goods} = require('@models/goods')
const {AddGoodsValidator,SearchValidator,PositiveIntegerValidator} = require('@validators/validator')
const {Auth} = require('@middlewares/auth')
const {success} = require('../../lib/helper')

const router = new Router({
    prefix:'/v1/goods/'
})

// 获取商品列表
router.get('get_goods_list', new Auth().m, async (ctx, next)=>{
    const v = await new SearchValidator().validate(ctx)

    const goods = await Goods.getAllGoods(
        v.get('query.goodsType'),
        v.get('query.qureyStr'),
        v.get('query.start'),
        v.get('query.limit'),ctx.auth.uid)

    // art.exclude = ['index','like_status']
    ctx.body = goods
})

// 新增商品接口
router.post('add_goods', new Auth().m, async (ctx, next)=>{

    const v = await new AddGoodsValidator().validate(ctx)
    const goods = await Goods.addGoods(
        v.get('body.goodsName'),
        v.get('body.image'),
        v.get('body.desc'),
        v.get('body.specs'),
        v.get('body.costPrice'),
        v.get('body.selPrice'),
        v.get('body.disPrice'),
        v.get('body.goodsType'),
        v.get('body.goodsNum'),ctx.auth.uid)
  
    // art.exclude = ['index','like_status']
    success()
})

// 删除商品信息
router.post('del_goods', new Auth().m, async (ctx, next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx)
    await Goods.delGoods(
        v.get('body.id'),
        ctx.auth.uid)
  
    // art.exclude = ['index','like_status']
    success()
})

// 更新商品信息
router.post('update_goods', new Auth().m, async (ctx, next)=>{
    const v = await new AddGoodsValidator().validate(ctx)
    await Goods.updateGoods(
        v.get('body.goodsName'),
        v.get('body.image'),
        v.get('body.desc'),
        v.get('body.specs'),
        v.get('body.costPrice'),
        v.get('body.selPrice'),
        v.get('body.disPrice'),
        v.get('body.goodsType'),
        v.get('body.id'),
        ctx.auth.uid)
  
    // art.exclude = ['index','like_status']
    success()
})

module.exports = router