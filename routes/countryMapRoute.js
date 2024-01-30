const express = require("express");
const countryMap_route = express();
const bodyParser = require("body-parser");
countryMap_route.use(bodyParser.json());
countryMap_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const CountryMap = require('./../controllers/countryMaping/countryMaping.controller')


countryMap_route.post(
    '/countryMap/addCountry',
    auth,
    CountryMap.addCountryMaping
);
countryMap_route.get(
    '/countryMap/getCountryMaping' ,
    auth,
    CountryMap.getCountryMaping
);
countryMap_route.patch(
    '/countryMap/editCountryMaping' ,
    auth,
    CountryMap.editCountryMaping
);
countryMap_route.delete(
    '/countryMap/deleteCountryMaping' ,
    auth,
    CountryMap.deleteCountryMaping
);
module.exports = countryMap_route