const {Op} = require('sequelize')
const {flatten} = require('lodash')

const {
    Movie,
    Music,
    Sentence,
    Book
} = require('./classic')

class Art{

    constructor(art_id, type){
        this.art_id = art_id
        this.type = type
    }

    async getDetail(uid){
        const art = await Art.getData(this.art_id, this.type)
        const {Favor} = require('@models/favor')

        if(!art){
            throw new global.errs.NotFound();
        }

        const like = await Favor.userLikeIt(this.art_id,this.type,uid)

        return {
            art,
            like_status:like
        }

    }

    static async getList(artInfoList, type,useScope=true){

        let arts = []
        const artInfoObj = {
            100:[],
            200:[],
            300:[]
        }

        for(let artInfo of artInfoList) {
            // artInfo.type artInfo.art_id
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }

        for (let key in artInfoObj){
            const ids = artInfoObj[key]
            if(!ids || ids.length === 0){
                continue
            }
            arts.push(await Art._getListByType(ids,parseInt(key))) 
        }

        return flatten(arts)
    }

    static async _getListByType(ids, type){
        let arts = null
        const finder = {
            where:{
                id:{
                    [Op.in]:ids
                }
            }
        }
        

        const scope = 'bh'
        switch (type) {
                // movie
            case 100:
                arts = await Movie.scope(scope).findAll(finder)
                break;
                // music
            case 200:
                arts = await Music.scope(scope).findAll(finder)
                break;
                // sentence
            case 300:
                arts = await Sentence.scope(scope).findAll(finder)
                break;
                // book
            case 400:
                break;
            default:
                break;
        }

        return arts
    }

    static async getData(art_id, type,useScope=true){

        const finder = {
            where:{
                id:art_id
            }
        }

        const scope = useScope?'bh':null

        let art = null
        switch (type) {
                // movie
            case 100:
                art = await Movie.scope(scope).findOne(finder)
                break;
                // music
            case 200:
                art = await Music.scope(scope).findOne(finder)
                break;
                // sentence
            case 300:
                art = await Sentence.scope(scope).findOne(finder)
                break;
                // book
            case 400:
                const {
                    Book
                } = require('./book')
                art = await Book.scope(scope).findOne(finder)
                if(!art){
                    art = await Book.create({
                        id:art_id
                    })
                }
                break;
            default:
                break;
        }

        return art

    }
}

module.exports = {
    Art
}