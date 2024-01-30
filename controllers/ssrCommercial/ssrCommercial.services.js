const ssrCommercialModel = require('../../models/SsrCommercial');

const addSsrCommercial = async(req,res) => {
    try{
        const {
            bookingType,
            flightCode,
            travelType,
            source,
            validDateFrom,
            validDateTo,
            status,
            description,
            gst,
            tds,
            seat,
            meal,
            baggage,
            companyId
          } = req.body;
      
          const newServiceRequest = new ssrCommercialModel({
            bookingType,
            flightCode,
            travelType,
            source,
            validDateFrom,
            validDateTo,
            status,
            description,
            gst,
            tds,
            seat,
            meal,
            baggage,
            companyId
          });
      
          const savedServiceRequest = await newServiceRequest.save();
          if(savedServiceRequest){
            return {
                response : 'Service request added successfully',
                data: savedServiceRequest,
            }
          }
         else{
            return {
                response : 'Service request not added'
            }
         }
    }catch(error){
        console.log(error);
        throw error
    }
};

const getSsrCommercialByCompany = async (req,res) => {
    try{
    let {companyId, bookingType} = req.query;
    const ssrCommercialData = await ssrCommercialModel.find({
        companyId: companyId,
        bookingType: bookingType
      });
    
     // console.log(ssrCommercialData);
    if(ssrCommercialData.length > 0){
        return {
            response : 'Data Found Sucessfully',
            data : ssrCommercialData
        }
    }else{
        return {
            response : 'Data Not Found Sucessfully',
        } 
    }

    }catch(error){
        console.log(error);
        throw error;
    }
};
const getSsrCommercialById = async (req,res) => {
    try{

    }catch(error){
        console.log(error);
        throw error;
    }
}
module.exports = {
    addSsrCommercial,
    getSsrCommercialByCompany,
    getSsrCommercialById
}