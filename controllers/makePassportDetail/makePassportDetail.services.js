const passportDetailsModel = require('../../models/PassPortDetailForAirline');

const addPassportDetailForAirline = async (req, res) => {
    const { airlineCode, passportNumber, passportExpiry, dateOfBirth, dateOfIssue, createdBy } = req.body;

    try {
        const newPassportDetails = new passportDetailsModel({
            airlineCode,
            passportNumber,
            passportExpiry,
            dateOfBirth,
            dateOfIssue,
            createdBy : req?.user?._id || null
        });

        const savedDetails = await newPassportDetails.save();
        if(savedDetails){
            return {
                response : 'Passport Details for airline is saved'
            }
        }else{
            return {
                response : 'Passport Details for airline is not saved'
            }
        }
        
    } catch (error) {
        console.error(error);
        throw error
    }
};
const updatePassportDetailForAirline = async (req,res) => {
    const id = req.query.id;
    const { passportNumber, passportExpiry, dateOfBirth, dateOfIssue,updatedBy } = req.body;

    try {
        const existingDetails = await passportDetailsForAirline.findOne({ passportNumber });

        if (!existingDetails) {

            return {
               response : 'Passport details not found for the given airline code.'
            }
        }

        existingDetails.passportNumber = passportNumber || existingDetails.passportNumber;
        existingDetails.passportExpiry = passportExpiry || existingDetails.passportExpiry;
        existingDetails.dateOfBirth = dateOfBirth || existingDetails.dateOfBirth;
        existingDetails.dateOfIssue = dateOfIssue || existingDetails.dateOfIssue;
        existingDetails.updatedBy = updatedBy || req?.user?._id || null ;

        const updatedDetails = await existingDetails.save();
        if(updatedDetails){
            return {
                response : 'Passport Details for airline is saved',
                data : updatedDetails
            }
        }else{
            return {
                response : 'Passport Details for airline is not saved'
            }
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

module.exports = {
  addPassportDetailForAirline,
  updatePassportDetailForAirline
}

