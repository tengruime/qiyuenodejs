module.exports = {
    //prod
    environment:'dev',
    database:{
        dbName:'yifengxiang',
        host:'localhost',
        port:3306,
        user:'root',
        password:'11111111'
    },
    security:{
        secretKey:'abcdefg',
        expiresIn:60*60*24*30
    },
    wx:{
        appId:'wx31fad95373476eb1',
        appSecret:'6f187c438c8f224f13695317fdf439ea',
        loginUrl:'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    }
}