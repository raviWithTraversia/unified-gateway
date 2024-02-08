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
   // let {id} = req.
   

    }catch(error){
        console.log(error);
        throw error
    }
};
module.exports = {
    addAirlineCred,
    updateAirlineCred
}