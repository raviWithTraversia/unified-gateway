const railBooking=require('../../../models/Irctc/bookingDetailsRail')
const {RailBookingCommonMethod}=require('../../../controllers/commonFunctions/common.function')
const StartBookingRail=async(req,res)=>{
    try{
        const {userId,companyId,cartId ,amount,paymentmethod,agencyId,clientTransactionId}=req.body;
console.log('sdjfdh')
        const requiredFields=["userId","companyId","cartId","amount", "paymentmethod","agencyId","clientTransactionId"]
        const missingFields = requiredFields.filter(
            (field) => !req.body[field] // Checks for undefined, null, empty
          );
          
          if (missingFields.length > 0) {
            const missingFieldsString = missingFields.join(", ");
            return res.status(400).json({
              response: null,
              isSometingMissing: true,
              data: `Missing or null fields: ${missingFieldsString}`,
            });
          }
          
const railBoookingDetails=await railBooking.find({cartId:cartId})
if(railBoookingDetails.length){
    return({
        response:"Your Booking allready exist"
    })
}
    const RailBooking=await RailBookingCommonMethod(userId,amount,companyId,cartId,paymentmethod)
    if(RailBooking.response=="Your Balance is not sufficient"){
        return({
            response:"Your Balance is not sufficient"
        })
    }
    
if(RailBooking.response="amount transfer succefully"){
    await railBooking.create({cartId:cartId,
        clientTransactionId:clientTransactionId,
        companyId:companyId,
        userId:userId,
        AgencyId:agencyId,
    })
}
return({
    response:"your amount transfer Succefully"
})

    }catch(error){
        throw error
    }
    }

    module.exports = {StartBookingRail}