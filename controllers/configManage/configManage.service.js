const airGstMandate = require("../../models/configManage/AirGSTMandate");
const Company = require("../../models/Company");
const addGSTMandate = async (req, res) => {
  try {
    let { companyId, airLine, fareFamily, promoCode } = req.body;

    const fieldNames = ["companyId", "airLine", "fareFamily"];
    const missingFields = fieldNames.filter(
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

    const existingDocument = await airGstMandate.findOne({
      companyId,
      airLine,
      fareFamily,
    });

    if (existingDocument) {
      return {
        response: "Records Already Exists",
      };
    }

    if (!companyId) {
      return {
        response: "company Id field are required",
      };
    }
    // Check company Id is exis or not
    const checkCompanyIdExist = await Company.find({ _id: companyId });

    if (checkCompanyIdExist.length === 0) {
      return {
        response: "Compnay id does not exist",
      };
    }

    const newAirGSTMandate = new airGstMandate({
      companyId,
      airLine,
      fareFamily,
      promoCode,
    });
    try {
      let newAirGSTMandateRes = await newAirGSTMandate.save();
      return {
        response: "Add Air GST Mandate Successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getairGSTMandate = async (req, res) => {
  try {
    const comapnyId = req.params.companyId;
    if (!comapnyId) {
      return {
        response: "Company Id required",
      };
    }

    const result = await airGstMandate.find({ companyId: comapnyId }).populate('airLine');
     console.log(result);
    // return false;
    if (result.length > 0) {
      return {
        response: "Fetch Data Successfully",
        data: result,
      };
    } else {
      return {
        response: "Company Id Not Valid",
        data: null,
      };
    }
  } catch (error) {
    throw error;
  }
};

const updateairGSTMandate = async (req, res) => {
  try {
    const airGstMandateId = req.params.airGstMandateId;
    // console.log(companyId);
    // return false;
    const { airLine, fareFamily, promoCode } = req.body;

    // Check if companyId is provided
    if (!airGstMandateId) {
      return {
        response: "Air GST Mandate Id required",
      };            
    }

    // Check if the record exists
    const existingRecord = await airGstMandate.findById(airGstMandateId);

    if (!existingRecord) {
      return {
        response: "Record not found for the provided Id",
      };
    }

    // Update the record with the new values
    existingRecord.airLine = airLine || existingRecord.airLine;
    existingRecord.fareFamily = fareFamily || existingRecord.fareFamily;
    existingRecord.promoCode = promoCode || existingRecord.promoCode;

    // Save the updated record
    const updatedRecord = await existingRecord.save();

    return {
      response: "Update Air GST Mandate Successfully",
      data: updatedRecord,
    };
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      response: null,
      error: "Internal Server Error",
    });
  }
};

const deleteGSTMandate = async(req,res) =>{
  try{
    const airGstMandateId = req.params.airGstMandateId;
    if (!airGstMandateId) {
      return {
        response: "Air GST Mandate Id required",
      };            
    }
    let deleteAirgst = await airGstMandate.findByIdAndDelete(airGstMandateId);
    if(deleteAirgst){
      return {
        response : 'Air GST Mandate Delete Sucessfully',
        data : deleteAirgst
      }
    }else{
      return {
        response : 'Air GST Mandate id not found'
      }
    }

  }catch(error){
    console.log(error);
    throw error
  }
}

module.exports = {
  addGSTMandate,
  getairGSTMandate,
  updateairGSTMandate,
  deleteGSTMandate
};
