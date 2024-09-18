const railBooking=require('../../../models/Irctc/bookingDetailsRail')
const RailBookingCommonMethod=require('../../../controllers/commonFunctions/common.function')
const StartBookingRail=async(req,res)=>{
    try{
        const {userId,companyId,cartId ,amount,paymentmethod}=req.body;
        if(!userId||!companyId||!cartId||!cartId||!amount ||!paymentmethod){
            return({
                response:"userID and companyId cartId paymentmethod"
            })
             }
const railBoookingDetails=await railBooking.findOne({cartId:cartId})
if(railBoookingDetails>0){
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


    }catch(error){
        throw error
    }
    }

    module.exports = {StartBookingRail}