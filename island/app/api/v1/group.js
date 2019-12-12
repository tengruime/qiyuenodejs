const Router = require('koa-router')
const { Group} = require('@models/group')
const {AddGroupValidator,PositiveIntegerValidator} = require('@validators/validator')
const {Auth} = require('@middlewares/auth')
const {success} = require('../../lib/helper')

const router = new Router({
    prefix:'/v1/group/'
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
        v.get('body.longitude'),
        v.get('body.latitude'),
        v.get('body.locationName'),
        v.get('body.goods'),ctx.auth.uid)
    
    ctx.body = group
    
})

// 新增团购信息
router.get('get_group', new Auth().m, async (ctx, next)=>{

    const v = await new PositiveIntegerValidator().validate(ctx)

    const group = await Group.getGroup(v.get('query.id'),ctx.auth.uid)
    
    ctx.body = group
    
})

// 获取热门团购信息
router.get('get_hot_groups', new Auth().m, async (ctx, next)=>{

    const groups = await Group.getHotGroups()
    
    ctx.body = groups
    
})

module.exports = router