const groupTicketRequestModel = require("../../models/GroupTicketRequest");
const addTicketRequset = async (req,res) => {
    try {
        const groupTicketRequest = await groupTicketRequestModel.create(req.body);
        if(!groupTicketRequest){
          return {
            response : 'Group Ticket Request Data Not Created'
          }
        }else{
            return {
                response : 'Group Ticket Request Data Created Sucessfully',
                data : groupTicketRequest
            }
        }
      } catch (error) {
        console.log(error.message);
        throw error
      }
};
const getTicketRequestId = async (req, res) => {
    try {
        const groupTicketRequest = await groupTicketRequestModel.findById(req.query.id).populate('agentId');
        console.log("===>>>",groupTicketRequest)
        if (!groupTicketRequest) {
          return { response: 'Group ticket request not found' };
        }
        else{
            return {
                response : "Group ticket request found sucessfully",
                data : groupTicketRequest
            }
        }
      } catch (error) {
       console.log( error.message );
       throw error
      }
};
const getTicketRequestByUserId = async (req, res) => {
    try {
        let userId = req.query.id;
        const groupTicketRequest = await groupTicketRequestModel.find({userId : userId});
        if (!groupTicketRequest) {
          return { response: 'Group ticket request not found' };
        }
        else{
            return {
                response : "Group ticket request found sucessfully",
                data : groupTicketRequest
            }
        }
      } catch (error) {
       console.log( error.message );
       throw error
      }
};

const updateTicketRequest = async (req,res) => {
    try {
        const groupTicketRequest = await GroupTicketRequest.findByIdAndUpdate(
          req.query.id,
          req.body,
          { new: true }
        );
        if (!groupTicketRequest) {
          return{
            response: 'Group ticket request not found' };
        }
        else{
            return {
                response : "Group ticket request updated sucessfully",
                data : groupTicketRequest
            }
        }

      } catch (error) {
        console.log( error.message );
       throw error
      }
}

module.exports = {
    addTicketRequset,
    getTicketRequestId,
    getTicketRequestByUserId,
    updateTicketRequest
}