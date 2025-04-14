const airportModels = require("../../models/AirportDetail");
const debounce = require("lodash/debounce");

const addAirportDetail = async (req, res) => {
  try {
    let {
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
      Language_Code,
    } = req.body;

    const requiredFields = [
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
      "Language_Code",
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
    }

    let newAirport = new airportModels({
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
      Language_Code,
    });
    await newAirport.save();
    return {
      response: "New Airport Added Sucessfully",
      data: newAirport,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAirportDetails = async (req, res) => {
  try {
    const { inputData } = req.body;
    if (!inputData) {
      return {
        response: `Input Data is Required`,
      };
    }
    const regex = new RegExp(`^${inputData}`, "i");
    let regexParts = inputData.split(/\s+/).map((part) => `(?=.*${part})`);
    let firstPipeLine = [
      {
        $match: {
          $or: [
            { Airport_Code: { $regex: regex } },
            { City_Name: { $regex: regex } },
          ],
        },
      },
      {
        $sort: {
          Airport_Code: -1,
          City_Name: -1,
          Airport_Name: -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
    ];

    let airports = await airportModels.aggregate(firstPipeLine);
    if (airports.length == 0) {
      let secondPipeLine = [
        {
          $match: {
            $or: [{ Airport_Name: new RegExp(regexParts.join(""), "i") }],
          },
        },
      ];
      airports = await airportModels.aggregate(secondPipeLine);
    }

    // console.log("airports =====>>>>>>>>>" , airports);
    let sortData = airports.sort((a, b) => {
      if (a.Country_Code === "IN" && b.Country_Code !== "IN") {
        return -1;
      } else if (a.Country_Code !== "IN" && b.Country_Code === "IN") {
        return 1;
      } else {
        return 0;
      }
    });
    if (airports.length === 0) {
      return {
        response: "Airport data Not Found",
      };
    }
    // console.log("=====>>>>>>>",sortData, "<<<===============")
    return {
      response: "Airport Details Found Successfully",
      data: sortData,
    };
  } catch (error) {
    console.error(error);
    return { error: `Invalid Input ${req?.inputData ?? ""}` };
    // res.status(500).json({ error: 'Internal Server Error' });
  }
};

const editAirportDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return {
        response: "_id not found",
      };
    }

    let {
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
      Language_Code,
    } = req.body;
    const oldAirprotDetail = await airportModels.findById(id);
    let UpdateAirport = await airportModels.findByIdAndUpdate(
      id,
      {
        City_Name: City_Name ? City_Name : oldAirprotDetail.City_Name,
        Country_Name: Country_Name
          ? Country_Name
          : oldAirprotDetail.Country_Name,
        Country_Code: Country_Code
          ? Country_Code
          : oldAirprotDetail.Country_Code,
        Country_Code_3Letter: Country_Code_3Letter
          ? Country_Code_3Letter
          : oldAirprotDetail.Country_Code_3Letter,
        Airport_Name: Airport_Name
          ? Airport_Name
          : oldAirprotDetail.Airport_Name,
        Airport_Code: Airport_Code
          ? Airport_Code
          : oldAirprotDetail.Airport_Code,
        City_Code: City_Code ? City_Code : oldAirprotDetail.City_Code,
        INS_GEO_Code: INS_GEO_Code
          ? INS_GEO_Code
          : oldAirprotDetail.INS_GEO_Code,
        Continent_Name: Continent_Name
          ? Continent_Name
          : oldAirprotDetail.Continent_Name,
        Continent_Code: Continent_Code
          ? Continent_Code
          : oldAirprotDetail.Continent_Code,
        Language_Code: Language_Code
          ? Language_Code
          : oldAirprotDetail.Language_Code,
      },
      { new: true }
    );
    if (!UpdateAirport) {
      return {
        response: "Airport data Not Found",
      };
    }
    return {
      response: "Update Airport Sucessfully",
      data: UpdateAirport,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  addAirportDetail,
  getAirportDetails,
  editAirportDetails,
};
