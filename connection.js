const mangoose = require("mongoose");

async function connectionMongoDb(url){
    return mangoose.connect(url);
}

module.exports = {
    connectionMongoDb
};