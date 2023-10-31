const websiteManagerService = require('./websiteManager.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');


const websiteManagerAdd = async (req, res) => {
   try {
       const result = await websiteManagerService.addwebsiteManager(req);
       if(result.response == 'Domain name field are required' || result.response == 'Name field are required' || result.response == 'company Id field are required' 
       || result.response == 'Compnay id does not exist' || result.response == 'Compnay id already exist') {
         apiErrorres(res,result.response,ServerStatusCode.BAD_REQUEST,true )
       }else{
        apiSucessRes(
            res,
            CrudMessage.WEBSIET_MANAGER_CREATED,
            result.response,
            ServerStatusCode.SUCESS_CODE
            )
       }
     
   }
    catch (error) {
       console.log(error);
       apiErrorres(
        res,
        errorResponse.SOMETHING_WRONG,
        ServerStatusCode.SERVER_ERROR,
        true )
    }
}

const retriveWebsiteManager = async(req ,res) => {
    try {
        const result = await websiteManagerService.getwebsiteManager(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
}


module.exports = {
    websiteManagerAdd,
    retriveWebsiteManager
}
