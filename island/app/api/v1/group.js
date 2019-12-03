const Router = require('koa-router')
const {Goods, Group, Content} = require('@models/group')
const {AddGroupValidator,PositiveIntegerValidator} = require('@validators/validator')
const {Auth} = require('@middlewares/auth')
const {success} = require('../../lib/helper')

const router = new Router({
    prefix:'/v1/group/'
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

// 新增团购信息
router.post('add_group', new Auth().m, async (ctx, next)=>{

    const v = await new AddGroupValidator().validate(ctx)

    const group = await Group.newGroups(
        v.get('body.title'),
        v.get('body.content'),
        v.get('body.groupWay'),
        v.get('body.distributionWay'),
        v.get('body.groupStartTime'),
        v.get('body.groupEndTime'),
        v.get('body.receivingAddress'),
        v.get('body.longitude'),
        v.get('body.latitude'),
        v.get('body.locationName'),
        v.get('body.goodsList'),ctx.auth.uid)
    
    ctx.body = {
        group
    }
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