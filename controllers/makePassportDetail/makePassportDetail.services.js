const passportDetailsModel = require('../../models/PassPortDetailForAirline');

// const addPassportDetailForAirline = async (req, res) => {
//     const { airlineCode, passportNumber, passportExpiry, dateOfBirth, dateOfIssue, createdBy } = req.body;

//     try {
//         const newPassportDetails = new passportDetailsModel({
//             airlineCode,
//             passportNumber,
//             passportExpiry,
//             dateOfBirth,
//             dateOfIssue,
//             updatedBy : req?.user?._id || null
//         });

//         const savedDetails = await newPassportDetails.save();
//         if(savedDetails){
//             return {
//                 response : 'Passport Details for airline is saved'
//             }
//         }else{
//             return {
//                 response : 'Passport Details for airline is not saved'
//             }
//         }
        
//     } catch (error) {
//         console.error(error);
//         throw error
//     }
// };
const updatePassportDetailForAirline = async (req,res) => {
    const passportDetailId = req.query.id;
    const updateData = req.body;

    try {
       
        const updatedPassportDetail = await passportDetailsModel.findByIdAndUpdate(
            passportDetailId,
            updateData,
            { new: true } 
        );

        if (!updatedPassportDetail) {
            return{
              response : 'PassportDetail not found' 
            }   
        }else{
            return {
                response : 'Data Updated Sucessfully',
                data: []
            }
        }

       
    } catch (error) {
      console.log(error);
      throw error
    }
};

const getPassportDetailForAirline = async (req,res) => {
    try{
        let data = await passportDetailsModel.find();
        return {
            response : 'Data Found Sucessfully',
            data : data
        }

    }catch(error){
        console.log(error);
        throw error
    }
}

module.exports = {
  //addPassportDetailForAirline,
  updatePassportDetailForAirline,
  getPassportDetailForAirline
}

