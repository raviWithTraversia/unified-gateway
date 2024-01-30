const status = require('../../models/Status');


const findStatusType = async(req,res) => {
  try{
    let statusId  = req.query.statusId;
    console.log(statusId)
    const isStatus = await status.find({_id: statusId});
    if(!isStatus){
        return {
            response : "Status not Found"
        }
    }
    else{
        return {
            response : "Status Found Sucessfully",
            data : isStatus
        }
    }
  }catch(error){
    console.log(error);
    throw error;
  }
}

const addStatusType = async(req,res) => {
  try{
    let { name , type } = req.body;

    const isStatus = await status.findOne({name});
    const isType = await status.findOne({type});
    let createStatus;
    if(!isStatus || !isType ){
        createStatus =  new status({
           name ,
           type

        });
        await createStatus.save();
        return {
            response : `New status created sucessfully`,
            data : createStatus
        }

    }
    else{
        return {
            response : 'This status or type aleady exist',

        }
    }

  }catch(error){
     console.log(error);
     throw error;
  }
}
const findAllStatusType = async (req,res) => {
    try {
        const findAllStatus = await status.find({});
        if(!findAllStatus){
            return {
                response : 'No status found'
            }
        }
        return {
            response : "All status fetch sucessfully",
            data : findAllStatus
        }

    }catch(error){
       console.log(error);
       throw error;
    }
}

module.exports = {
    findStatusType,
    addStatusType,
    findAllStatusType  
}