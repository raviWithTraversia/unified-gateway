const couponCodeModel = require('../../models/CouponCode');


const addCouponCode  = async(req,res) => {
    try{
    let {
        journeyType,
        rbd,
        discountType,
        calculateTds,
        minTicketValue,
        maxDiscountValue,
        agentThresholdTotalCount,
        agentThresholdDayCount,
        globalThresholdUsesCount,
        globalThresholdValueCount,
        codeName,
        status,
        assignUser
       } = req.body;
      
      // logic
      // check coupon code is already exist  journeyType and  
      let checkIsCouponCodeExist = await couponCodeModel.find({journeyType : journeyType,codeName : codeName});
      if(checkIsCouponCodeExist.length > 0){
        return {
            response : 'Coupon alrady code exist'
        }
      }
      let createCoupon = new couponCodeModel({
        journeyType,
        rbd,
        discountType,
        calculateTds,
        minTicketValue,
        maxDiscountValue,
        agentThresholdTotalCount,
        agentThresholdDayCount,
        globalThresholdUsesCount,
        globalThresholdValueCount,
        codeName,
        status,
        assignUser,
        createdBy : req?.user?._id || null,
        modifyBy : req?.user?._id || null
      });
      await createCoupon.save();

      return {
        response : 'Coupon Created Sucessfully',
        data : codeName
      }

    }catch(error){
      console.log(error);
      throw error
    }
};

const getCouponCodeByUserId = async (req,res) => {
    try{
    let assignUser = req.query.id;
    let couponCode = await couponCodeModel.find({assignUser :assignUser, status : "Active"});
    if(couponCode.length > 0){
       return {
        response : 'Coupon Code Data Found Sucessfully',
        data : couponCode
       }
    }else{
        return {
          response : 'Coupon Code Data Not Found', 
        }
    }
    }catch(error){
      console.log(error);
      throw error
    }
}

const updateCouponCode = async (req,res) => {
    try{
        let { id } = req.query;
        let updateData = {
          ...req.body
        };
        let updateDiData = await couponCodeModel.findByIdAndUpdate(
            id,
            {
              $set: updateData,
              modifyBy: req?.user?._id || null,
            },
            { new: true }
          );
          if (updateDiData) {
            return {
              response: "Coupon Code Updated Sucessfully",
              data: updateDiData,
            };
          } else {
            return {
              response: "Coupon Code Not Updated",
            };
          }
    }catch(error){
       console.log(error);
       throw error
    }
};

const deleteCoupanCode = async (req,res) => {
    try{
        let id = req.params.id;
        let deleteCoupon = await couponCodeModel.findByIdAndDelete(id) ;
        if(deleteCoupon){
          return {
              response : 'Coupon deleted sucessfully'
          }
        }
        else{
          return {
              response : 'Coupon not deleted'
          }
        }
  
      }catch(error){
        console.log(error);
        throw error
      }
};

// const getCouponCodeById = async (req,res) => {
//   try{
//   let {id} = req.params;
//   let couponCode = await couponCodeModel.findById({id});
//   if(couponCode.length > 0){
//      return {
//       response : 'Coupon Code Data Found Sucessfully',
//       data : couponCode
//      }
//   }else{
//       return {
//         response : 'Coupon Code Data Not Found', 
//       }
//   }
//   }catch(error){
//     console.log(error);
//     throw error
//   }
// }

module.exports = {
    addCouponCode,
    getCouponCodeByUserId,
    updateCouponCode,
    deleteCoupanCode,
   // getCouponCodeById
}