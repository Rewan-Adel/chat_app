const moment = require('moment');

let generateMsg = (from, text)=>{
    return{
        from,
        text,
        createdAt: moment().valueOf()
    }

}

let locationMsg = (lat, lon)=>{
    return {
        from: "Admin",
        url: `https://www.google.com/maps?q=${lat},${lon}`,
        createdAt: moment().valueOf()

    }
}

module.exports = {generateMsg, locationMsg};