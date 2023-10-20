module.exports.Config = {   
    PORT: process.env.PORT || 3010,    
    SECRET_JWT: process.env.SECRET_JWT || "kafilapanel",
    MONGODB_URL:process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/kafila",
    HOST: 'smtp.hostinger.com',
    USER: 'developer@traversia.tech',
    PASS: 'Ttpl@2023'
};