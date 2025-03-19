const travellersDetailsModel = require("../../models/booking/TravellersDetails");

const getAllTravellers = async (req, res) => {
  try {
    let { companyId } = req.body;

    const requiredFields = ["companyId"];

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
    const allTravellers = await travellersDetailsModel.find({
      companyId: companyId,
    });
    if (!allTravellers?.length) {
      return {
        response: "Data not found",
        data: allTravellers,
      };
    }
    return {
      response: "Fetch Data Successfully",
      data: allTravellers,
    };
  } catch (error) {
    return {
      IsSucess: false,
      response: error.message,
    };
  }
};
const addTravellers = async (req, res) => {
  try {
    let { userId, companyId, emailId, phoneNumber, TravellersDetails } =
      req.body;

    const requiredFields = [
      "userId",
      "companyId",
      "emailId",
      "phoneNumber",
      "TravellersDetails",
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
    let TravellersDetailsList = [];
    const existingTravellers = await travellersDetailsModel.findOne({
      companyId: companyId,
      emailId: emailId.toLowerCase(),
      phoneNumber: phoneNumber,
    });
    const existingTravellerNames = existingTravellers
      ? existingTravellers.TravellersDetails.map((traveller) => ({
          fName: traveller.FName.toLowerCase(),
          lName: traveller.LName.toLowerCase(),
        }))
      : [];

    for (let traveller of TravellersDetails) {
      const fNameLowerCase = traveller.FName.toLowerCase();
      const lNameLowerCase = traveller.LName.toLowerCase();

      const exists = existingTravellerNames.some(
        (existing) =>
          existing.fName === fNameLowerCase && existing.lName === lNameLowerCase
      );
      if (exists) continue;
      TravellersDetailsList.push(traveller);
    }
    if (TravellersDetailsList.length === 0) {
      return {
        response: "Travellers details already exist..!",
        data: TravellersDetailsList,
      };
    }

    if (existingTravellers) {
      await travellersDetailsModel.updateOne(
        {
          companyId: companyId,
          emailId: emailId.toLowerCase(),
          phoneNumber: phoneNumber,
        },
        {
          $push: {
            TravellersDetails: {
              $each: TravellersDetailsList.map((traveller) => ({
                PaxType: traveller?.PaxType,
                Title: traveller?.Title,
                FName: traveller?.FName,
                LName: traveller?.LName,
                Gender: traveller?.Gender,
                Dob: traveller?.Dob,
                Optional: {
                  PassportNo: traveller?.Optional.PassportNo,
                  PassportExpiryDate: traveller?.Optional?.PassportExpiryDate,
                  PassportIssuedDate: traveller?.Optional?.PassportIssuedDate,
                  FrequentFlyerNo: traveller?.Optional?.FrequentFlyerNo,
                  Nationality: traveller?.Optional?.Nationality,
                  ResidentCountry: traveller?.Optional?.ResidentCountry,
                },
              })),
            },
          },
        }
      );
    } else {
      const newTravellers = new travellersDetailsModel({
        userId: userId,
        companyId: companyId,
        TravellersDetails: TravellersDetailsList.map((traveller) => ({
          PaxType: traveller?.PaxType,
          Title: traveller?.Title,
          FName: traveller?.FName,
          LName: traveller?.LName,
          Gender: traveller?.Gender,
          Dob: traveller?.Dob,
          Optional: {
            PassportNo: traveller?.Optional.PassportNo,
            PassportExpiryDate: traveller?.Optional?.PassportExpiryDate,
            PassportIssuedDate: traveller?.Optional?.PassportIssuedDate,
            FrequentFlyerNo: traveller?.Optional?.FrequentFlyerNo,
            Nationality: traveller?.Optional?.Nationality,
            ResidentCountry: traveller?.Optional?.ResidentCountry,
          },
        })),
        emailId: emailId.toLowerCase(),
        phoneNumber: phoneNumber,
        modifyBy: userId,
        createdBy: userId,
      });

      await newTravellers.save();
    }

    return {
      response: "Travellers details saved successfully.",
      data: TravellersDetailsList,
    };
  } catch (error) {
    return {
      IsSucess: false,
      response: error.message,
    };
  }
};
module.exports = {
  getAllTravellers,
  addTravellers,
};
