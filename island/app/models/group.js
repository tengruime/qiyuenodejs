const {sequelize} = require('../../core/db')
const {Sequelize,Model,Op} = require('sequelize')

class Group extends Model{

    // 新增团购信息
    static async newGroups(title,content,group_way,distribution_way,group_start_time,group_end_time,receiving_address,longitude,latitude,goods_ids,uid){

        const group = await Goods.create({
            title,
            content,
            group_way,
            distribution_way,
            group_start_time,
            group_end_time,
            receiving_address,
            longitude,
            latitude,
            goods_ids,
            uid
        })

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

}

class Content extends Model{ 
    // 新增团购信息
    static async newContents(content,path,group_id,type,uid){

        const content = await Content.create({
            path,
            content,
            group_id,
            type,
            uid
        })

        return content

    } 
}

class Goods extends Model{ 
    // 新增商品信息
    static async addGoods(name,image,desc,specs,cost_price,sel_price,dis_price,goods_type,good_num,group_id,uid){

        sel_price = parseFloat(sel_price)
        dis_price = parseFloat(dis_price)
        cost_price = parseFloat(cost_price)
        const goods = await Goods.create({
            name,
            image,
            desc,
            specs,
            cost_price,
            sel_price,
            dis_price,
            goods_type,
            good_num,
            group_id,
            uid
        })

        return goods

    }
}

Group.init({
    // 主题
    title:Sequelize.STRING,
    // 内容（文字、图片、视频）
    content:Sequelize.STRING,
    // 拼团方式（0:商品数量，1:参团人数）
    group_way:Sequelize.INTEGER,
    // 配送方式
    distribution_way:Sequelize.STRING,
    // 拼团开始时间
    group_start_time:Sequelize.DATE,
    // 拼团结束时间
    group_end_time:Sequelize.DATE,
    // 收货地址
    receiving_address:Sequelize.STRING,
    // 经度
    longitude:Sequelize.DECIMAL,
    // 纬度
    latitude:Sequelize.DECIMAL,
    // 商品ids
    goods_ids:Sequelize.STRING,
    // 团购状态 0未发布 1已发布 2已下架
    status:Sequelize.INTEGER,
    // 团购所属发布用户
    uid:Sequelize.INTEGER
    
},{
    sequelize,
    tableName:'group'
})

Content.init({
    // 主题
    path:Sequelize.STRING,
    // 内容（文字、图片、视频）
    content:Sequelize.STRING,
    // 内容所属团购
    group_id:Sequelize.INTEGER,
    // 用户id
    uid:Sequelize.INTEGER,
    // 内容类型
    type:Sequelize.INTEGER
},{
    sequelize,
    tableName:'group_content'
})

Goods.init({
     // 商品名称
     name:Sequelize.STRING,
     // 商品图片信息
     image:Sequelize.STRING,
     // 商品描述信息
     desc:Sequelize.STRING,
     // 商品规格信息
     specs:Sequelize.STRING,
     // 成本价格
     cost_price:Sequelize.DECIMAL(10,2),
     // 销售价
     sel_price:Sequelize.DECIMAL(10,2),
     // 分销价
     dis_price:Sequelize.DECIMAL(10,2),
     // 商品类型
     goods_type:Sequelize.INTEGER,
     // 商品库存
     good_num:Sequelize.INTEGER,
     // 用户id
     uid:Sequelize.INTEGER,
     // 商品所属团购
    group_id:Sequelize.INTEGER
},{
    sequelize,
    tableName:'group_goods'
})

module.exports = {
    Group,
    Content,
    Goods
}