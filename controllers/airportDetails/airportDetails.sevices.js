const airportModels = require('../../models/AirportDetail');
const debounce = require('lodash/debounce');

const addAirportDetail = async (req , res)=> {
    try{
    let { 
        Airport_DetailsId,
        City_Name,
        Country_Name,
        Country_Code,
        Country_Code_3Letter,
        Airport_Name,
        Airport_Code,
        City_Code,
        INS_GEO_Code,
        Continent_Name,
        Continent_Code,
        Language_Code
    } = req.body;

    const requiredFields = [
        "Airport_DetailsId",
        "City_Name",
        "Country_Name",
        "Country_Code",
        "Country_Code_3Letter",
        "Airport_Name",
        "Airport_Code",
        "City_Code",
        "INS_GEO_Code",
        "Continent_Name",
        "Continent_Code",
        "Language_Code"
      ];
  
      const missingFields = requiredFields.filter(
        (fieldName) =>
          req.body[fieldName] === null || req.body[fieldName] === undefined
      );
      if (missingFields.length > 0) {
        const missingFieldsString = missingFields.join(", ");
        return {
          response: null,
          isSometingMissing: true,
          data: `Missing or null fields: ${missingFieldsString}`,
        };
      };

      let newAirport = new airportModels({
        Airport_DetailsId,
        City_Name,
        Country_Name,
        Country_Code,
        Country_Code_3Letter,
        Airport_Name,
        Airport_Code,
        City_Code,
        INS_GEO_Code,
        Continent_Name,
        Continent_Code,
        Language_Code
    });
    await newAirport.save();
    return {
        response : 'New Airport Added Sucessfully',
        data : newAirport
    }

    }catch(error){
        console.log(error);
        throw error
    }
};

const getAirportDetails = async (req, res) => {
    try {
        const { inputData } = req.body;

        if (!inputData) {
            return {
                response: `Input Data is Required`
            }
        }

        const regex = new RegExp(`^${inputData}`, 'i');

        const airports = await airportModels.aggregate([
            {
                $match: {
                    $or: [
                        { Airport_Code: { $regex: regex } },
                        { City_Name: { $regex: regex } },
                        { Airport_Name: { $regex: regex } }
                    ]
                }
            },
            {
                $sort: {
                    Airport_Code: -1,
                    City_Name: -1,
                    Airport_Name: -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    doc: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$doc" }
            }
        ]);
        

        if (airports.length === 0) {
            return {
                response: 'Airport data Not Found'
            }
        }

        return {
            response: 'Airport Details Found Successfully',
            data: airports//.Airport_Code.sort()
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    addAirportDetail,
    getAirportDetails
}