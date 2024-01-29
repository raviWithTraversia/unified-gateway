const CouponController = require('./couponCode.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addCouponCode = async (req,res) => {
    try{
        const result = await CouponController.addCouponCode(req,res);
        if(result.response == 'Coupon Created Sucessfully'){
          apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
          )
        }
        else if(result.response == 'Coupon alrady code exist'){
         apiErrorres(
          res,
          result.response,
          ServerStatusCode.NOT_EXIST_CODE,
          true
         )
        }else{
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
        }
      }catch(error){
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
      }
};

const getCouponCodeByUserId = async (req,res) => {
    try{
        const result = await CouponController.getCouponCodeByUserId(req,res);
        if(result.response == 'Coupon Code Data Found Sucessfully'){
          apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
          )
        }
        else if(result.response == 'Coupon Code Data Not Found'){
         apiErrorres(
          res,
          result.response,
          ServerStatusCode.NOT_EXIST_CODE,
          true
         )
        }else{
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
        }
      }catch(error){
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
      }
};

const updateCouponCode = async (req,res) => {
    try{
        const result = await CouponController.updateCouponCode(req,res);
        if(result.response == 'Coupon Code Updated Sucessfully'){
          apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
          )
        }
        else if(result.response == 'Coupon Code Not Updated'){
         apiErrorres(
          res,
          result.response,
          ServerStatusCode.NOT_EXIST_CODE,
          true
         )
        }else{
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
        }
      }catch(error){
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
      }
};

const deleteCouponCode = async (req,res) => {
    try{
        const result = await CouponController.deleteCoupanCode(req,res);
        if(result.response == 'Coupon deleted sucessfully'){
          apiSucessRes(
              res,
              result.response,
              result.data,
              ServerStatusCode.SUCESS_CODE
          )
        }
        else if(result.response == 'Coupon not deleted'){
         apiErrorres(
          res,
          result.response,
          ServerStatusCode.NOT_EXIST_CODE,
          true
         )
        }else{
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
        }
      }catch(error){
          apiErrorres(
              res,
              errorResponse.SOME_UNOWN,
              ServerStatusCode.INVALID_CRED,
              true
            )
      }
};

//getCouponCodeById
// const getCouponCodeById = async (req,res) => {
//   try{
//       const result = await CouponController.getCouponCodeById(req,res);
//       if(result.response == 'Coupon Code Data Found Sucessfully'){
//         apiSucessRes(
//             res,
//             result.response,
//             result.data,
//             ServerStatusCode.SUCESS_CODE
//         )
//       }
//       else if(result.response == 'Coupon Code Data Not Found'){
//        apiErrorres(
//         res,
//         result.response,
//         ServerStatusCode.NOT_EXIST_CODE,
//         true
//        )
//       }else{
//         apiErrorres(
//             res,
//             errorResponse.SOME_UNOWN,
//             ServerStatusCode.INVALID_CRED,
//             true
//           )
//       }
//     }catch(error){
//         apiErrorres(
//             res,
//             errorResponse.SOME_UNOWN,
//             ServerStatusCode.INVALID_CRED,
//             true
//           )
//     }
// };

module.exports = {
    addCouponCode,
    getCouponCodeByUserId,
    updateCouponCode,
    deleteCouponCode,
   // getCouponCodeById
}