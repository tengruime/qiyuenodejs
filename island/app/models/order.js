const {sequelize} = require('../../core/db')
const {Sequelize,Model,Op} = require('sequelize')
const groupModel = require('./group')

class Order extends Model{
    // 新增团购订单
    static async newOrder(group_id,address_id,group_way,distribution_type,contact_name,contact_phone,address,remark,goods,uid){

        // 数据库事物处理
        return sequelize.transaction(async t =>{

            let goodsIds = [];
            for (let index = 0; index < goods.length; index++) {

                // 创建订单商品信息
                const element = goods[index];
                const price = parseFloat(element.sel_price)
                const result = await Goods.create({
                    name:element.name,
                    image:element.image,
                    desc:element.desc,
                    specs:element.specs,
                    price,
                    goods_type:element.goods_type,
                    goods_num:element.num,
                    uid,
                    group_goods_id:element.id
                },{transaction:t})
                goodsIds.push(result.id)

            
                // 更新团购商品购买数量
                const groupGoods = await groupModel.Goods.findOne({
                    where:{
                        id:element.id
                    }
                })
                var groupGoodsNum =  parseInt(groupGoods.group_nums)
                groupGoodsNum += element.num
                await groupModel.Goods.update({
                    group_nums:groupGoodsNum
                },{
                    where:{
                        id:element.id
                    }
                },{transaction:t})
            }

            const order = await Order.create({
                group_id,
                address_id,
                group_way,
                distribution_type,
                contact_name,
                contact_phone,
                address,
                remark,
                goods_ids:goodsIds.join(","),
                uid
            },{transaction:t})

            // 更新团购相关信息
            const group = await groupModel.Group.findOne({
                where:{
                    id:group_id
                }
            })
            var group_mebs = group.group_mebs +','+uid
            if(!group_mebs) {
                group_mebs = uid.toString()
            }
            await groupModel.Group.update({
                group_mebs
            },{
                where:{
                    id:group_id
                }
            },{transaction:t})

            return order
        })

    }

    // 获取当前用户的团购信息
    static async getUserOrders(start,limit,uid){
 
        start = parseInt(start)
        limit = parseInt(limit)
        const orders = await Order.findAll({
            offset: start * limit,
            limit: limit,
            where:{
                uid
            }
        })

        for(let i=0;i<orders.length;i++) {

            const order = orders[i]

            const goods = await Order.getOrderGoods(order)
    
            // 获取团购相关信息
            const group = await groupModel.Group.findOne({
                where:{
                    id:order.group_id
                }
            })

            for (let index = 0; index < goods.length; index++) {
                let item = goods[index]
                const groupGoods = await groupModel.Goods.findOne({
                    where:{
                        id:item.group_goods_id
                    }
                })

                item.setDataValue('totalNum',groupGoods.goods_num)
                item.setDataValue('groupNums',groupGoods.group_nums)

            }
            
            order.setDataValue('goods',goods)
            order.setDataValue('group',group)

            // Order.removeAttribute('goods_ids')
        }
         
        return orders
    }

    static async getOrderGoods(order){

        const goods_ids = order.goods_ids.split(",")
            const goods_ids_int = []
            goods_ids.forEach(item => {  
                item = parseInt(item)
                goods_ids_int.push(item)
            });  
         

        const goods = await Goods.findAll({
            where:{
                id:{
                    [Op.in]:goods_ids_int
                }
            }
        })

        return goods
    }

    static async updateGroupGoods(group){

        const goods_ids = group.goods_ids.split(",")
            const goods_ids_int = []
            goods_ids.forEach(item => {  
                item = parseInt(item)
                goods_ids_int.push(item)
            });  
         

        const goods = await Goods.findAll({
            where:{
                id:{
                    [Op.in]:goods_ids_int
                }
            }
        })

        return goods
    }
    
}
class Goods extends Model{ }

Order.init({
    // 商品名称
    group_id:Sequelize.INTEGER,
    // 商品ids
    goods_ids:Sequelize.STRING,
    // 地址id记录方便以后查找
    address_id:Sequelize.INTEGER,
    // 联系信息
    address:Sequelize.STRING,
    // 联系信息
    contact_name:Sequelize.STRING,
    // 联系信息
    contact_phone:Sequelize.STRING,
    // 团购类型
    group_way:Sequelize.INTEGER,
    // 用户ID
    uid:Sequelize.INTEGER,
    // 配送方式
    distribution_type:Sequelize.INTEGER,
    // 备注
    remark:Sequelize.STRING
},{
   sequelize,
   tableName:'orders'
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
    // 价格
    price:Sequelize.DECIMAL(10,2),
    // 商品类型
    goods_type:Sequelize.INTEGER,
    // 购买数量
    goods_num:Sequelize.INTEGER,
    // 用户id
    uid:Sequelize.INTEGER,
    // 所购买商品id
    group_goods_id:Sequelize.INTEGER

},{
   sequelize,
   tableName:'order_goods'
})

module.exports = {
    Order,
    Goods
}