const {sequelize} = require('../../core/db')
const {Sequelize,Model,Op} = require('sequelize')
const {Art} = require('./art')

class Favor extends Model {
    // 业务表 点赞
    static async like(art_id, type, uid){
        const favor = await Favor.findOne({
            where:{
                art_id,
                type,
                uid
            }
        })
        if(favor){
            throw new global.errs.LikeError()
        }

        // 数据库事物处理
        return sequelize.transaction(async t =>{
            await Favor.create({
                art_id,
                type,
                uid
            },{transaction:t})
            const art = await Art.getData(art_id,type,false)
            await art.increment('fav_nums',{by:1,transaction:t})
        })
    }

    //取消点赞
    static async disLike(art_id, type, uid){
        const favor = await Favor.findOne({
            where:{
                art_id,
                type,
                uid
            }
        })
        if(!favor){
            throw new global.errs.DislikeError()
        }

        // 数据库事物处理
        return sequelize.transaction(async t =>{
            await favor.destroy({
                // 是否物理删除
                force:true,
                transaction:t
            })
            const art = await Art.getData(art_id,type,false)
            await art.decrement('fav_nums',{by:1,transaction:t})
        })
    }

    // 个人的喜欢
    static async getMyClassicFavors(uid){
        const arts = await Favor.findAll({
            where:{
                uid,
                type:{
                    // 操作符：非
                    [Op.not]:400
                }
            }
        })
        
        if(!arts){
            throw new global.errs.NotFound()
        }

        // 数据库事物处理
        return await Art.getList(arts)
        
    }

    // 获取点赞状态
    static async userLikeIt(art_id, type, uid){
        const favor = await Favor.findOne({
            where:{
                art_id,
                type,
                uid
            }
        })
        
        return favor?true:false
        
    }
}

Favor.init({
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
},{
    sequelize,
    tableName:'favor'
})

module.exports = {
    Favor
}