const {sequelize} = require('../../core/db')
const {Sequelize,Model} = require('sequelize')

class Collect extends Model{

    // 获取个人参与拼团信息
    static getMyCollection(userID){

    }

}

Collect.init({
    goods_id:Sequelize.INTEGER,
    image:Sequelize.STRING,
    desc:Sequelize.STRING,
    specs:Sequelize.STRING,
    cost_price:Sequelize.DECIMAL,
    sel_price:Sequelize.DECIMAL,
    dis_price:Sequelize.DECIMAL,
    goods_type:Sequelize.STRING
    
},{
    sequelize,
    tableName:'collect'
})

module.exports = {
    Collect
}