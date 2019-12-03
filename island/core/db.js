const {Sequelize,Model} = require('sequelize')
const {unset, clone, isArray}  = require('lodash')
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

Model.prototype.toJSON = function(){
    // let data = this.dataValues
    let data = clone(this.dataValues)
    // unset(data, 'updated_at')
    // unset(data, 'created_at')
    // unset(data, 'deleted_at')

    for(key in data){
        if(key === 'image'){
            if(!data[key].startsWith('http')) {
                data[key]=global.config.host + data[key]
            }
        }
    }

    if(isArray(this.exclude)){
        this.exclude.forEach(element => {
            unset(data,element)
        });
    }

    return data
}

module.exports = {
    sequelize
}