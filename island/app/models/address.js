const {sequelize} = require('../../core/db')
const {Sequelize,Model} = require('sequelize')


class Address extends Model{

    // 获取地址信息
    static async getAddress(address_id,uid){

        const address = await Address.findOne({
            where:{
                id:address_id,
                uid
            }
        })

        return address

    }

    // 获取地址列表信息
    static async getAllAddress(uid){

        const address = await Address.findAll({
            where:{
                uid
            }
        })

        return address

    }

    // 新增地址信息
    static async addAddress(name,phone,detail_address,receive_address,uid){

        const address = await Address.create({
            name,
            phone,
            detail_address,
            receive_address,
            uid
        })

        return address

    }

    // 删除地址信息
    static async delAddress(id,uid){

        const address =  await this.getGoods(id,uid)
        if(!goods){
            throw new global.errs.NotFound()
        }

        return await address.destroy({
            // 是否物理删除
            force:true
        })
    }

    // 更新地址信息
    static async updateAddress(name,phone,detail_address,receive_address,id,uid){

        const address = await this.getAddress(id,uid)
        if(!address){
            throw new global.errs.NotFound()
        }

        return await address.update({
            name,
            phone,
            detail_address,
            receive_address,
        },{
            where:{
                uid,
                id
            }
        })
    }

    // 设置地址默认信息
    static async setDefaultAddress(isdefault,id,uid){

        const address = await this.getAddress(id,uid)
        if(!address){
            throw new global.errs.NotFound()
        }

        return await address.update({
            isdefault
        },{
            where:{
                uid,
                id
            }
        })
    }

    // 获取默认地址信息
    static async getDefaultAddress(uid){
        

        let address = await Address.findOne({
            where:{
                isdefault:true,
                uid
            }
        })

        if(!address){
            address = await Address.findAll({
                limit:1,
                where:{
                    uid
                }
            })

            if(address.length > 0){
                address = address[0]
            }
        }
        if(!address){
            throw new global.errs.NotFound()
        }

        return address

    }

}

Address.init({
    // 姓名
    name:Sequelize.STRING,
    // 电话号码
    phone:Sequelize.STRING,
    // 详细地址信息
    detail_address:Sequelize.STRING,
    // 省市区地址
    receive_address:Sequelize.STRING,
    // 用户id
    uid:Sequelize.INTEGER,
    // 是否默认地址
    isdefault:Sequelize.BOOLEAN
    
},{
    sequelize,
    tableName:'address'
})

module.exports = {
    Address
}