const Router = require('koa-router')
const {HotBook} = require('@models/hot-book')
const {PositiveIntegerValidator,SearchValidator,AddShortCommentValidator} = require('@validators/validator')
const {Book} = require('@models/book')
const {Auth} = require('@middlewares/auth')
const {Favor} = require('@models/favor')
const {Comment} = require('@models/book-comment')
const {success} = require('../../lib/helper')

const router = new Router({
    prefix:'/v1/book'
})

router.get('/hot_list',async (ctx,next)=>{
    const books = await HotBook.getAll()
    // ctx.body = {key:"book"}
    ctx.body = books

})

router.get('/:id/detail',async (ctx,next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx)
    const book = await new Book()
    ctx.body = await book.detail(v.get('path.id'))
})

router.get('/search',async (ctx,next)=>{
    const v = await new SearchValidator().validate(ctx)
    const result = await Book.searchFromYuShu(v.get('query.q'),v.get('query.start'),v.get('query.count'))
    ctx.body = result
})

router.get('/favor/count',new Auth().m,async (ctx,next)=>{
    const count = await Book.getMyFavorBookCount(ctx.auth.uid)
    ctx.body = {
        count
    }
})

router.get('/:book_id/favor',new Auth().m,async (ctx,next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx,{
        id:'book_id'
    })
    const favor = await Favor.getBookFavor(ctx.auth.uid,v.get('path.book_id'))
    ctx.body = {
        favor
    }
})

router.get('/add/short_comment',new Auth().m,async (ctx,next)=>{
    const v = await new AddShortCommentValidator().validate(ctx,{
        id:'book_id'
    })
    await Comment.addComment(v.get('query.book_id'),v.get('query.content'))
    success()
})

router.get('/:book_id/short_comment',new Auth().m,async (ctx,next)=>{
    const v = await new PositiveIntegerValidator().validate(ctx,{
        id:'book_id'
    })
    const comments = await Comment.getComments(v.get('path.book_id'))
    ctx.body = comments
})

router.get('/hot_keyword',async (ctx,next)=>{
    
    ctx.body = {
        'hot': ['iOS',
            '哈利',
            '伯特',
            '白夜行',
            '薛之谦',
            '罗大炮'
        ]
    }
})

module.exports = router