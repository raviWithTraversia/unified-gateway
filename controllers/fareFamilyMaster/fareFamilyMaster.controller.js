const fareFamilyMasterService = require('./fareFamilyMaster.service');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const getFareFamilyListData = async(req, res) => {
    try {
        const result = await fareFamilyMasterService.getFareFamilyMaster(req);
        if(result.response == 'Fare Family available' ){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
        }else if(result.response == 'Fare Family not available'){
            apiErrorres(
                res,
                result.data,
                ServerStatusCode.NOT_EXIST_CODE,
                true
            )
        }else{
            apiErrorres(
                res,
                errorResponse.SOMETHING_WRONG,
                ServerStatusCode.CONTENT_NOT_FOUND,
                true
            )
        } 
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}


const addFareFamilyMaster = async(req, res) => {
    try {
        const result = await fareFamilyMasterService.addFareFamilyMaster(req,res);
        console.log(result.data)

        if(result.response === 'New Fare family Added Sucessfully' ){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
        }else if(result.response === 'comany Id not TMC'){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.NOT_EXIST_CODE,
                true
            )
        }else{
            apiErrorres(
                res,
                errorResponse.SOMETHING_WRONG,
                ServerStatusCode.CONTENT_NOT_FOUND,
                true
            )
        } 
    } catch (error) {
        console.log(error)
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}


const editFareFamilyMaster = async(req, res) => {
    try {
        const result = await fareFamilyMasterService.editFareFamilyMaster(req,res);
        console.log(result.data)

        if(result.response === 'edit Fare family Sucessfully' ){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
        }else if(result.response === 'comany Id not TMC'){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.NOT_EXIST_CODE,
                true
            )
        }else if(result.response== "req params id not define"||result.response== "fare family not found"){
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.NOT_EXIST_CODE,
                true
            )

        }
        else{
            apiErrorres(
                res,
                errorResponse.SOMETHING_WRONG,
                ServerStatusCode.CONTENT_NOT_FOUND,
                true
            )
        } 
    } catch (error) {
        console.log(error)
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

module.exports = {getFareFamilyListData,addFareFamilyMaster,editFareFamilyMaster}