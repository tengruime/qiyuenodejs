const {LinValidator,Rule} = require('../../core/lin-validator-v2')
const {User} = require('@models/user')
const {LoginType,ArtType} = require('@lib/enum')

class PositiveIntegerValidator extends LinValidator {
    constructor(){
        super()
        //且关系
        this.id = [
            new Rule('isInt',"需要正整数",{min:1}),
        ]
    }
}
class RegisterValidator extends LinValidator {
    constructor(){
        super()
        this.account = [
            new Rule('isLength','请输入正确的手机号码',{
                min:11,
                max:11
            })
        ]
        this.password1 = [
            // 用户指定范围
            new Rule('isLength','密码至少6个字符，最多32个字符',{
                min:6,
                max:32
            }),
            new Rule('matches','密码不符合规范','^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
        this.password2 = this.password1
        this.nickname = [
            new Rule('isLength','昵称长度不对',{
                min:4,
                max:32
            }),
        ]
    }

    validatePassword(vals){
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if(psw1!=psw2){
            throw new Error('两个密码必须相同')
        }
    }

    async validateEmail(vals) {
        const email = vals.body.email
        const user = await User.findOne({
            where:{
                email:email
            }
        })
        if(user) {
            throw new Error('email已存在')
        }
    }
}

class TokenValidator extends LinValidator{
    constructor(){
        super()
        this.account = [
            new Rule('isLength','不符合帐号规则',{
                min: 4,
                max: 32
            })
        ]
        this.secret = [
            new Rule('isOptional'),
            new Rule('isLength','至少6个字符',{
                min: 6,
                max: 128
            })
        ]
        // type
    }

    validateLoginType(vals){
        if(!vals.body.type){
            throw new Error('type是必须参数')
        }
        if(!LoginType.isThisType(vals.body.type)){
            throw new Error('type参数不合法')
        }
    }
}

class NotEmptyValidator extends LinValidator {
    constructor(){
        super()
        this.token = [
            new Rule('isLength','不允许为空',{min:1})
        ]
    }
}

function checkLoginType(vals){

    let type = vals.body.type || vals.path.type
    if(!type){
        throw new Error('type是必须参数')
    }
    type = parseInt(type)
    // this.parsed.path.type = type
    if(!LoginType.isThisType(type)){
        throw new Error('type参数不合法')
    }
}

function checkArtType(vals){

    let type = vals.body.type || vals.path.type
    if(!type){
        throw new Error('type是必须参数')
    }
    type = parseInt(type)
    // this.parsed.path.type = type
    if(!ArtType.isThisType(type)){
        throw new Error('type参数不合法')
    }
}

class LikeValidator extends PositiveIntegerValidator {
    constructor(){
        super()
        this.validateType = checkArtType
        // const checker = new Checker(ArtType)
        // this.validateType = checker.check.bind(checker)
    }
}

class DislikeValidator extends PositiveIntegerValidator {
    constructor(){
        super()
        this.validateType = checkArtType
    }
}

class ClassicValidator extends LikeValidator {

}

class SearchValidator extends LinValidator {
    constructor(){
        super()
        // this.q = [
        //     new Rule('isLength','搜索关键字不能为空',{
        //         min: 0,
        //         max: 6
        //     })
        // ]
        this.start = [
            new Rule('isInt','不符合规范',{
                min:0,
                max: 60000
            }),
            new Rule('isOptional','',0)
        ]
        this.limit = [
            new Rule('isInt','不符合规范',{
                min:1,
                max: 20
            }),
            new Rule('isOptional','',20)
        ]
    }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
    constructor(){
        super()
        this.content = [
            new Rule('isLength','必须在1-12个字符',{
                    min:1,
                    max:12
            })
        ]
    }
}

// 新增商品校验器
class AddGoodsValidator extends LinValidator {
    constructor(){
        super()
        this.goodsName,this.desc,this.specs = [
            // new Rule('isNotEmpty','内容不能为空'),
            new Rule("isLength", "长度必须大于1", 1)
        ]
        this.costPrice,this.selPrice = [
            new Rule('isFloat','金额不符合规范',{
                min:0.01
            })
        ]
        this.goodsNum=[
            new Rule('isInt','库存不能为0',{
                min:1
            })
        ]
    }
}

// 新增团购校验器
class AddGroupValidator extends LinValidator {
    constructor(){
        super()
        this.title = [
            // new Rule('isNotEmpty','内容不能为空'),
            new Rule("isLength", "长度必须大于1", 1)
        ]
        // this.costPrice,this.selPrice = [
        //     new Rule('isFloat','金额不符合规范',{
        //         min:0.01
        //     })
        // ]
        // this.goodsNum=[
        //     new Rule('isInt','库存不能为0',{
        //         min:1
        //     })
        // ]
    }
}

class PhoneNumValidator extends LinValidator {
    constructor(){
        super()
        this.phone = [
            new Rule('isLength','请输入正确的手机号码',{
                min:11,
                max:11
            })
        ]
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator,
    DislikeValidator,
    ClassicValidator,
    SearchValidator,
    AddShortCommentValidator,
    AddGoodsValidator,
    AddGroupValidator,
    PhoneNumValidator
}