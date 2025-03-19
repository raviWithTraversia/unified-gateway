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
    for (let traveller of TravellersDetails) {
      const fNameLowerCase = traveller.FName.toLowerCase();
      const lNameLowerCase = traveller.LName.toLowerCase();
      const existingTraveller = await travellersDetailsModel.findOne({
        companyId: companyId,
        emailId: emailId,
        phoneNumber: phoneNumber,
        "TravellersDetails.FName": fNameLowerCase,
        "TravellersDetails.LName": lNameLowerCase,
      });

      if (existingTraveller) continue;
      TravellersDetailsList.push(traveller);
    }
    if (TravellersDetailsList?.length == 0) {
      return {
        response: "Travellers details already exist..!",
        data: TravellersDetailsList,
      };
    }
    const newTravellers = new travellersDetailsModel({
      userId: userId,
      companyId: companyId,
      TravellersDetails: TravellersDetailsList?.map((travellers) => ({
        PaxType: travellers?.PaxType,
        Title: travellers?.Title,
        FName: travellers?.FName.toLowerCase(),
        LName: travellers?.LName.toLowerCase(),
        Gender: travellers?.Gender,
        Dob: travellers?.Dob,
        Optional: {
          PassportNo: travellers?.Optional.PassportNo,
          PassportExpiryDate: travellers?.Optional?.PassportExpiryDate,
          PassportIssuedDate: travellers?.Optional?.PassportIssuedDate,
          FrequentFlyerNo: travellers?.Optional?.FrequentFlyerNo,
          Nationality: travellers?.Optional?.Nationality,
          ResidentCountry: travellers?.Optional?.ResidentCountry,
        },
      })),
      emailId: emailId.toLowerCase(),
      phoneNumber: phoneNumber,
      modifyBy: userId,
      createdBy: userId,
    });
    await newTravellers.save();
    return {
      response: "Created travellers successfully",
      data: newTravellers,
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
