const {
    Movie,
    Music,
    Sentence
} = require('./classic')

class Art{
    static async getData(art_id, type){

        const finder = {
            where:{
                id:art_id
            }
        }

        let art = null
        switch (type) {
                // movie
            case 100:
                art = await Movie.findOne(finder)
                break;
                // music
            case 200:
                art = await Music.findOne(finder)
                break;
                // sentence
            case 300:
                art = await Sentence.findOne(finder)
                break;
                // book
            case 400:
            
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