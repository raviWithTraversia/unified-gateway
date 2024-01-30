const ssrCommercialModel = require('../../models/SsrCommercial');

const addSsrCommercial = async(req,res) => {
    try{
        const {
            seat,
            meal,
            baggage,
            bookingType,
            flightCode,
            travelType,
            source,
            validDateFrom,
            validDateTo,
            status,
            description,
            modifyBy,
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
            seat,
            meal,
            baggage,
            companyId,
            modifyBy : req?.user?._id || null
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
      }).populate('flightCode source');
    
     // console.log(ssrCommercialData);
    if(ssrCommercialData.length > 0){
        return {
            response : 'Service Request Data Found Sucessfully',
            data : ssrCommercialData
        }
    }else{
        return {
            response : 'Service Request Data Not Found',
        } 
    }

    }catch(error){
        console.log(error);
        throw error;
    }
};
const getSsrCommercialById = async (req,res) => {
    try{
      let id = req.query.id;
      let ssrData = await ssrCommercialModel.findById(id).populate();
      if(ssrData){
        return {
            response : ''
        }
      }
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