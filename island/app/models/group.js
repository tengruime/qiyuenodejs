const {sequelize} = require('../../core/db')
const {Sequelize,Model,Op} = require('sequelize')

class Group extends Model{

    // 新增团购信息
    static async newGroups(title,content,group_way,distribution_way,group_start_time,group_end_time,longitude,latitude,receiving_address,goods,uid){

        // 数据库事物处理
        // return sequelize.transaction(async t =>{
            

            const content_ids = await Content.newContents(content)

            const goods_ids = await Goods.addGoods(goods)

            const group = await Group.create({
                title,
                content:content_ids.join(","),
                group_way:group_way.type,
                distribution_type:distribution_way.type,
                distribution_name:distribution_way.typeName,
                distribution_iscontact:distribution_way.contact,
                distribution_isphone:distribution_way.phone,
                distribution_isaddress:distribution_way.address,
                group_start_time,
                group_end_time,
                receiving_address,
                longitude,
                latitude,
                goods_ids:goods_ids.join(","),
                uid
            })

            return group
        // })

    }

    // 获取团购信息
    static async getGroup(groupId,uid){
 
        const group = await Group.findOne({
            where:{
                id:groupId,
                uid
            }
        })

        const content_ids = group.content.split(",")

        const goods_ids = group.goods_ids.split(",")

        const goods = await Goods.findAll({
            where:{
                id:{
                    [Op.in]:goods_ids
                }
            }
        })
        const contents = await Content.findAll({
            where:{
                id:{
                    [Op.in]:content_ids
                }
            }
        })

        group.content = contents
        group.setDataValue('goods',goods)
        return group
    }

    // 参与团购
    static async newGroupOrder(groupId,uid){
 
        const group = await Group.findOne({
            where:{
                id:groupId,
                uid
            }
        })

        const content_ids = group.content.split(",")

        const goods_ids = group.goods_ids.split(",")

        const goods = await Goods.findAll({
            where:{
                id:{
                    [Op.in]:goods_ids
                }
            }
        })
        
        const contents = await Content.findAll({
            where:{
                id:{
                    [Op.in]:content_ids
                }
            }
        })

        group.content = contents
        group.goods = goods
        return group
    }

    // 获取最近的十条团购信息
    static async getHotGroups(){
 
        const groups = await Group.findAll({
            limit:10
        })

        for(let i=0;i<groups.length;i++) {

            const group = groups[i]
            const content_ids = group.content.split(",")

            const goods_ids = group.goods_ids.split(",")

            const goods = await Goods.findAll({
                where:{
                    id:{
                        [Op.in]:goods_ids
                    }
                }
            })
            const contents = await Content.findAll({
                where:{
                    id:{
                        [Op.in]:content_ids
                    }
                }
            })

            group.content = contents
            group.setDataValue('goods',goods)
        }
         
        return groups
    }

}

class Content extends Model{ 
    // 新增团购内容信息
    static async newContents(content){

        let contentIds = [];
        for (let index = 0; index < content.length; index++) {
            const element = content[index];
            let path = ""
            if(element.type == 1) {
                path = element.imagePath
            }
            else if(element.type == 2) {
                path = element.video
            }
            const item = await Content.create({
                path:path,
                content:element.text,
                type:element.type
            })
            contentIds.push(item.id)
        }

        return contentIds

    } 
}

class Goods extends Model{ 
    // 新增商品信息
    static async addGoods(goods){

        let goodsIds = [];
        for (let index = 0; index < goods.length; index++) {
            const element = goods[index];
            const sel_price = parseFloat(element.selPrice)
            const dis_price = parseFloat(element.disPrice)
            const cost_price = parseFloat(element.costPrice)
            const result = await Goods.create({
                name:element.goodsName,
                image:element.image,
                desc:element.desc,
                specs:element.specs,
                cost_price,
                sel_price,
                dis_price,
                goods_type:element.goodsType,
                goods_num:element.goodsNum
            })
            goodsIds.push(result.id)
        }

        return goodsIds

    }
}

Group.init({
    // 主题
    title:Sequelize.STRING,
    // 内容（文字、图片、视频）
    content:Sequelize.STRING,
    // 拼团方式（0:商品数量，1:参团人数）
    group_way:Sequelize.INTEGER,
    // 配送方式 0快递发货 1提货点自取 2没有物流
    distribution_type:Sequelize.INTEGER,
    // 配送方式名称
    distribution_name:Sequelize.STRING,
    // 是否需要填写联系方式
    distribution_iscontact:Sequelize.BOOLEAN,
    // 是否需要填写联系方式
    distribution_isphone:Sequelize.BOOLEAN,
    // 是否需要填写联系方式
    distribution_isaddress:Sequelize.BOOLEAN,
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
    uid:Sequelize.INTEGER,
    // 团购所参与用户数
    group_mebs:Sequelize.STRING
},{
    sequelize,
    tableName:'group_body'
})

Content.init({
    // 主题
    path:Sequelize.STRING,
    // 内容（文字、图片、视频）
    content:Sequelize.STRING,
    // // 内容所属团购
    // group_id:Sequelize.INTEGER,
    // 用户id
    // uid:Sequelize.INTEGER,
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
     goods_num:Sequelize.INTEGER,
     // 用户id
    //  uid:Sequelize.INTEGER,
    //  // 商品所属团购
    // group_id:Sequelize.INTEGER
    // 团购目前购买数量
    group_nums:Sequelize.STRING,
},{
    sequelize,
    tableName:'group_goods'
})

module.exports = {
    Group,

}