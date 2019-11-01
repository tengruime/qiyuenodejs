const {sequelize} = require('../../core/db')
const {Sequelize,Model} = require('sequelize')

class Comment extends Model{
    static async addComment(bookID, content){
        const comment = await Comment.findOne({
            where:{
                book_id:bookID,
                content
            }
        })

        if(!comment){
            return await Comment.create({
                book_id:bookID,
                content,
                nums:1
            })
        } else {
            return await Comment.increment('nums',{
                by:1
            })
        }
    }
}

Comment.init({
    content:Sequelize.toString(12),
    nums:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    book_id:Sequelize.INTEGER
},{
    sequelize,
    tableName:'comment'
})

module.exports = {
    Comment
}