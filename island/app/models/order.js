const {sequelize} = require('../../core/db')
const {Sequelize,Model,Op} = require('sequelize')
const {Group} = require('./group')

class Order extends Model{
    // 新增团购订单
    static async newOrder(group_id,address_id,group_way,distribution_type,contact_name,contact_phone,address,remark,goods,uid){

        // 数据库事物处理
        return sequelize.transaction(async t =>{

            let goodsIds = [];
            for (let index = 0; index < goods.length; index++) {
                const element = goods[index];
                const price = parseFloat(element.price)
                const result = await Goods.create({
                    name:element.goodsName,
                    image:element.image,
                    desc:element.desc,
                    specs:element.specs,
                    price,
                    goods_type:element.goodsType,
                    goods_num:element.goodsNum,
                    uid,
                    group_goods_id:element.id
                },{transaction:t})
                goodsIds.push(result.id)
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
            const group = await Group.findOne({
                where:{
                    id:group_id
                }
            })
            var group_mebs = group.group_mebs +','+uid
            if(!group_mebs) {
                group_mebs = uid.toString()
            }
            await Group.update({
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
 
        start = parseInt(start) - 1
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

            const goods_ids = order.goods_ids.split(",")
            const goods_ids_int = []
            goods_ids.forEach(item => {  
                goods_ids_int.push(+item)
            });  
         

            const goods = await Goods.findAll({
                where:{
                    id:{
                        [Op.in]:goods_ids_int
                    }
                }
            })
    
            // for (let index = 0; index < goods.length; index++) {
            //     const element = goods[index];
            //     const orderGoods = await Order.findOne({
            //         where:{
            //             id:element.group_goods_id
            //         }
            //     })
            //     element.group_nums = 0
            // }
            order.setDataValue('goods',goods)
            Order.removeAttribute('goods_ids')
        }
         
        return orders
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