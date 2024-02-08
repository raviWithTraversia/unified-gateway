const manageAirlineCredentialModel = require('../../models/ManageAirlineCred');

const addAirlineCred = async (req,res) => {
    try{
    let {supplierCodeId , allowed,searchAllowed,bookAllowed,importAllowed,companyId} = req.body;
    let insertAirlineCred = new manageAirlineCredentialModel({
        supplierCodeId , 
        allowed,
        searchAllowed,
        bookAllowed,
        importAllowed,
        companyId ,
        modifyBy : req.user._id
    });
    insertAirlineCred = await insertAirlineCred.save();
    if(insertAirlineCred){
        return {
            response : 'Airline Credential Data Insert Sucessfully',
            data : insertAirlineCred
        }
    } else{
        return {
            response : 'Airline Credntial Data Not Inserted'
        }
    }

    }catch(error){
        console.log(error);
        throw error
    }
};
const updateAirlineCred = async (req,res) => {
    try{
        const companyId = req.query.id;
        const updateData = req.body;
        const updatedPassportDetail = await manageAirlineCredentialModel.findOneAndUpdate(
                { companyId: companyId },
                { $set: updateData },
                { new: true }
                )
            if (!updatedPassportDetail) {
                return{
                  response : 'Data not Updated' 
                }   
            }else{
                return {
                    response : 'Data Updated Sucessfully',
                    data: []
                }
            }

    }catch(error){
        console.log(error);
        throw error
    }
};
const getAirlineCred = async (req,res) => {
    try{
        let data = await manageAirlineCredentialModel.find();
        if(data){
            return {
                response : 'Data Found Sucessfully',
                data : data
            }
        }else{
            return {
                response : "Data Not Found"
            }
        }  
    }catch(error){
        console.log(error);
        throw error
    }
};

module.exports = {
    addAirlineCred,
    updateAirlineCred,
    getAirlineCred
}