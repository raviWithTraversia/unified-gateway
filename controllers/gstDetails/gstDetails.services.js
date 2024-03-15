const gstDetailsModel = require('../../models/GstDetail');

const addGstDetail = async (req,res) => {
    try{
      const existingGstDetails = await gstDetailsModel.findOne({ gstNumber: req.body.gstNumber });

  if (existingGstDetails) {
    return {
      response: 'GST number already exists',
      data: existingGstDetails 
    };
  }
        let gstDetails = new gstDetailsModel(req.body);
        gstDetails = await gstDetails.save();
        if(gstDetails){
          return {
            response : 'Gst Data Added Sucessfully',
            data : gstDetails
          }
        }else{
          return {
            response : 'Gst Data Not Added'
          }
        }

    }catch(error){
      console.log(error);
      throw error
    }
};
const getGstDetail = async (req , res) => {
    try{
    let userId = req.query.userId;
    let gstDetaildata =  await gstDetailsModel.find({userId : userId }).populate('userId companyId');
    console.log("====>>>",gstDetaildata)
    if(gstDetaildata.length > 0){
        return {
            response : 'Gst Data Fetch sucessfully',
            data : gstDetaildata
        }
    }else{
       return {
        response : 'Gst Data Not Found'
       }
    }

    }catch(error){
        console.log(error);
        throw error
    }
}
module.exports = {
    addGstDetail,
    getGstDetail
}