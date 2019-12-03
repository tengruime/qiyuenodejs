const {sequelize} = require('../../core/db')
const {Sequelize,Model,Op} = require('sequelize')

class Goods extends Model{

    // 获取商品信息
    static async getGoods(goodsID,uid){

        const goods = await Goods.findOne({
            where:{
                id:goodsID,
                uid
            }
        })

        return goods

    }

    // 新增商品信息
    static async addGoods(name,image,desc,specs,cost_price,sel_price,dis_price,goods_type,good_num,uid){

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
            uid
        })

        return goods

    }

    // 获取商品库信息
    static async getAllGoods(goodsType,qureyStr,start,limit,uid){

        let selectCondtion = {
            uid,
            name:{
                [Op.like]:'%' + qureyStr + '%'
            }
        }
        if(goodsType != 0) {
            selectCondtion.goods_type = goodsType
        }

        const goodsList = await Goods.findAndCountAll({
            offset: start * limit,
            limit: limit,
            where:selectCondtion
        })

        return goodsList
    }

    // 删除某个商品信息
    static async delGoods(id,uid){

        const goods =  await this.getGoods(id,uid)
        if(!goods){
            throw new global.errs.NotFound()
        }

        return await goods.destroy({
            // 是否物理删除
            force:true
        })
    }

    // 更新某个商品信息
    static async updateGoods(name,image,desc,specs,cost_price,sel_price,dis_price,goods_type,good_num,id,uid){

        const goods = await this.getGoods(id,uid)
        if(!goods){
            throw new global.errs.NotFound()
        }

        return await goods.update({
            name,
            image,
            desc,
            specs,
            cost_price,
            sel_price,
            dis_price,
            goods_type,
            good_num
        },{
            where:{
                uid,
                id
            }
        })
    }

}

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
    uid:Sequelize.INTEGER
    
},{
    sequelize,
    tableName:'goods'
})

module.exports = {
    Goods
}