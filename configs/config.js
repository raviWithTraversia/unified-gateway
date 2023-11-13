module.exports.Config = {       
    SECRET_JWT: process.env.SECRET_JWT || "kafilapanel",
    MONGODB_URL:process.env.MONGODB_URL || "mongodb+srv://hsbhandari:fl1I9D8gtsbeHzdO@cluster0.xdzp3sk.mongodb.net/b2bportal",
    HOST: 'smtp.hostinger.com',
    USER: 'developer@traversia.tech',
    PASS: 'Ttpl@2023',
    BASE_URL : "http://localhost:3111/api/",
    PAN_URL : 'https://api.atlaskyc.com/v2/prod/verify/pan',
    HADDER_3RD_PAERT : {
        'Accept': 'application/json',
        'Authorization': 'Basic ay0zNzU2OGVjOS0zNzBiLTRiMDctYTlkOS03MWNiYjViNGQxNjM6cy01YTExMGE0MS05MGE2LTQ1ZjItOTM3YS1iYzE2NzQ4ZWE3MzA='
      }
};