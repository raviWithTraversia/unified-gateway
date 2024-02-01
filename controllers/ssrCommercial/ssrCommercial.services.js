const ssrCommercialModel = require('../../models/SsrCommercial');
const { response } = require('../../routes/countryMapRoute');

const addSsrCommercial = async(req,res) => {
    try{
        const {
            seat,
            meal,
            baggage,
            bookingType,
            airlineCode,
            travelType,
            supplierCode,
            validDateFrom,
            validDateTo,
            status,
            description,
            modifyBy,
            companyId
          } = req.body;
      
          const newServiceRequest = new ssrCommercialModel({
            bookingType,
            airlineCode,
            travelType,
            supplierCode,
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
      }).populate('airlineCode supplierCode');
    
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
      let ssrData = await ssrCommercialModel.findById(id).populate('flightCode source');
      if(ssrData){
        return {
            response : ''
        }
      }
    }catch(error){
        console.log(error);
        throw error;
    }
};

const editSsrCommercial = async (req,res) => {
  try { 
    let {id} = req.query;
    let dataForUpdate = {
        ...req.body
    };
  
    let existingSsrData = await ssrCommercialModel.findByIdAndUpdate(
        id,
        {
          $set: dataForUpdate,
        },
        { new: true }
      );
    
    if(existingSsrData){
        return {
            response : 'Data Updated Sucessfully',
            data : existingSsrData
        }
    }else{
        return {
            response : 'Data Not Updated'
        }
    }

}catch(error){
    console.log(error);
    throw error
}
}
const deleteSsrCommercial = async (req,res) => {
    try{
    let {id} = req.query;
    let deleteSsrCommercial = await ssrCommercialModel.findByIdAndDelete(id)
    if(deleteSsrCommercial){
        return {
            response : 'Ssr Commercial Data Deleted Sucessfully',
            data : []
        }
    }else{
       return {
        reponse : `Ssr Commercial Data For This Id Is Not Found`
       }
    }

    }catch(error){
        console.log(error);
        throw error;
    }
};


module.exports = {
    addSsrCommercial,
    getSsrCommercialByCompany,
    getSsrCommercialById,
    deleteSsrCommercial,
    editSsrCommercial
}