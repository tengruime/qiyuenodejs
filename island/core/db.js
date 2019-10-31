const Sequelize = require('sequelize')
const {
    dbName,
    host,
    port,
    user,
    password
} = require('../config/config').database

const sequelize = new Sequelize(dbName,user,password,{
    dialect:'mysql',
    host,
    port,
    loggin:true,
    timezone: '+08:00',
    define:{
        timestamps:true,
        paranoid:true,
        createdAt:'created_at',
        updatedAt:'updated_at',
        deletedAt:'deleted_at',
        underscored:true,
        freezeTableName:true,
        scopes:{
            bh:{
                attributes:{
                    exclude:['updated_at','deleted_at','created_at']
                }
            }
        }
    }
    // define([
    //     'require',
    //     'dependency'
    // ], function(require, factory) {
    //     'use strict';
        
    // });
})

sequelize.sync({
    //设置为true会每次删除数据库
    force:false
})

module.exports = {
    sequelize
}