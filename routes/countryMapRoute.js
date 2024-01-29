const express = require("express");
const countryMap_route = express();
const bodyParser = require("body-parser");
countryMap_route.use(bodyParser.json());
countryMap_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const CountryMap = require('./../controllers/countryMaping/countryMaping.controller')


countryMap_route.post(
    '/countryMap/addCountry' ,
    auth,
    CountryMap.addCountryMaping
);
module.exports = countryMap_route