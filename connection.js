const mangoose = require("mongoose");

async function connectionMongoDb(url){
    console.log("connected")
    return mangoose.connect(url);
}

module.exports = {
    connectionMongoDb
};