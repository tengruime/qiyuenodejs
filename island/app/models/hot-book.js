const {sequelize} = require('../../core/db')
const {Sequelize,Model} = require('sequelize')

class HootBook extends Model {

}

HootBook.init({
    index:Sequelize.INTEGER,
    image:Sequelize.STRING,
    author:Sequelize.STRING,
    title:Sequelize.STRING
},{
    sequelize,
    tableName:'user'
})

module.exports = {
    HootBook
}