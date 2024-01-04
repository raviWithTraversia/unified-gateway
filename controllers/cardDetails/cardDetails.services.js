const cardDetailModel = require('../../models/CardDetails');
const bcrypt = require('bcryptjs');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');


const addCardDetails = async (req,res) => {
    try{
        const requiredFields = [
            "bankName",
            "cardNumber",
            "cardHolderName",
            "expiryMonth",
            "expiryYear",
            "Address1",
            "Address2",
            "cityId",
            "Pincode",
            "DisplayName",
            "billingCycleDayFrom",
            "billingCycleDayTo",
            "cardType",
            "ApplicableOnBookingSupplier",
            "cvv"
          ];
      
          const missingFields = requiredFields.filter(
            (fieldName) =>
              req.body[fieldName] === null || req.body[fieldName] === undefined
          );
          if (missingFields.length > 0) {
            const missingFieldsString = missingFields.join(", ");
            return {
              response: null,
              isSometingMissing: true,
              data: `Missing or null fields: ${missingFieldsString}`,
            };
          };
    const hashedCVV = await bcrypt.hash(cvv, cvv.length)
    const existingCard = await cardDetailModel.findOne({ cardNumber: req.body.cardNumber }, {bankName : req.body.bankName});
        if (existingCard) {
            return {
                response : 'Card with this card number already exists!'
            }
        }
        let cardDetail = new cardDetailModel({
            ...req.body,
            cvv: hashedCVV
        });
        cardDetail = await cardDetail.save();
        if(cardDetail){
            return {
                response : "Card Details Added Sucessfully",
                data : "Sucessfully Saved"
            }
        }else{
            response : "Card Details Not Added "
        }
    }catch(error){
      console.log(error);
      throw error
    }
};

const deleteCardDetails = async (req,res) => {
    try{
        let { cardId } = req.query;
            const cardDetail = await cardDetailModel.findByIdAndDelete(cardId);
            if (!cardDetail) {
                return {
                 response : 'Card detail not found' ,  
                 data : "Deleted Sucessfully"
            }
        }else{
            return {
                response : 'Card detail deleted successfully'
            }
        }  

    }catch(error){
      console.log(error);
    }
};

const updateCardDetails = async (req,res) => {
    try{
        const {cardId} = req.query;
        
        let cardDetail = await cardDetailModel.findById(cardId);
        if (!cardDetail) {
            return {
                response : 'Card details not found'
            }  
        }
        if (req.body.cvv) {
            req.body.cvv = await bcrypt.hash(req.body.cvv, 10);
        }
        cardDetail = await cardDetailModel.findByIdAndUpdate(cardId, req.body, { new: true });
        if(cardDetail){
          return {
            response : 'Card details update sucessfully',
            data : "Card Details Updated"
          }
        }   

    }catch(error){
        console.log(error);
        throw error
    }
};
const getCardDetails = async (req,res) => {
    try{
        const {cardId} = req.query;
        
      let cardDetails = await cardDetailModel.findById(cardId);
      if(cardDetails){
        return {
            response : "Card Details Fetch Sucessfully",
            data : cardDetails
        }
      }else{
        return{
            response : 'Card details Not Found'
        }
      }

    }catch(error){
        console.log(error);
        throw error
    }
}
module.exports = {
    addCardDetails,
    deleteCardDetails,
    updateCardDetails,
    getCardDetails

}