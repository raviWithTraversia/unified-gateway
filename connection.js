const mangoose = require("mongoose");

async function connectionMongoDb(url){
    console.log("connected")
    // mangoose.set('debug', true);
    return mangoose.connect(url);
}

module.exports = {
    connectionMongoDb
};