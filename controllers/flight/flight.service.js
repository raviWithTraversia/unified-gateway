//const airGstMandate = require("../../models/configManage/AirGSTMandate");

const getSearch = async (req, res) => {
    const { Authentication, TypeOfTrip, Segments, PaxDetail, TravelType } = req.body;
    //let companyId = Authentication.CompanyId;
    
    // middleware for flight search 
    /// get suppliere data from agency
     
    console.log(Authentication.CompanyId)
    return false;
};

module.exports = {  
    getSearch  
};
