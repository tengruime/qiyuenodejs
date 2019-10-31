const Router = require('koa-router')
const classic = require('@models/classic')
const {Flow} = require('@models/flow')
const {Art} = require('@models/art')
const {PositiveIntegerValidator,ClassicValidator} = require('@validators/validator')
const {Auth} = require('@middlewares/auth')
const {Favor} = require('@models/favor')
const router = new Router({
    prefix:'/v1/classic/'
})

router.get('latest', new Auth().m, async (ctx, next)=>{
    const flow = await Flow.findOne({
        order:[
            //倒序查找
            ['index','DESC']
        ]
    })

    const art = await Art.getData(flow.art_id,flow.type)
    const likeLatest = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid)
    //实际序列化的是MODE的dataValues下面
    // art.dataValues.index = flow.index
    art.setDataValue('index',flow.index)
    art.setDataValue('like_status',likeLatest)

    ctx.body = art
})

//获取下一期期刊
router.get(':index/next', new Auth().m, async (ctx, next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx,{
        id:'index'
    })

    const index = v.get('path.index')

    const flow = await Flow.findOne({
        where:{
            index:index+1
        }
    })

    if(!flow) {
        throw new global.errs.NotFound()
    }

    const art = await Art.getData(flow.art_id,flow.type)
    const likeNext = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid)
    //实际序列化的是MODE的dataValues下面
    // art.dataValues.index = flow.index
    art.setDataValue('index',flow.index)
    art.setDataValue('like_status',likeNext)

    ctx.body = art
})

// 获取上一期期刊
router.get(':index/previous', new Auth().m, async (ctx, next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx,{
        id:'index'
    })

    const index = v.get('path.index')

    const flow = await Flow.findOne({
        where:{
            index:index - 1
        }
    })

    if(!flow) {
        throw new global.errs.NotFound()
    }

    const art = await Art.getData(flow.art_id,flow.type)
    const likePre = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid)
    //实际序列化的是MODE的dataValues下面
    // art.dataValues.index = flow.index
    art.setDataValue('index',flow.index)
    art.setDataValue('like_status',likePre)

    ctx.body = art
})

// 获取期刊详情
router.get(':type/:id', new Auth().m, async (ctx, next)=>{

    const v = await new ClassicValidator().validate(ctx)
    const type = parseInt(v.get('path.type'))
    const id = v.get('path.id')
    const artDetail = await new Art(id,type).getDetail(ctx.auth.uid)
    
    artDetail.art.setDataValue('like_status',artDetail.like_status)

    ctx.body = artDetail.art

})

// 获取点赞期刊
router.get(':type/:id/favor', new Auth().m, async (ctx, next)=>{

    const v = await new ClassicValidator().validate(ctx)
    const type = parseInt(v.get('path.type'))
    const id = v.get('path.id')
    const artDetail = await new Art(id,type).getDetail(ctx.auth.uid)

    ctx.body = {
        fav_nums:artDetail.art.fav_nums,
        like_status:artDetail.like_status
    }

})

router.get('favor', new Auth().m, async (ctx, next)=>{
    const uid = ctx.auth.uid
    ctx.body = await Favor.getMyClassicFavors(uid)
})

module.exports = router