const userServices = require("./user.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");

const registerUser = async (req, res) => {
  try {
    const result = await userServices.registerUser(req);
    if (
      result.response == "All fields are required" ||
      result.response == "Invalid email format" ||
      result.response == "Password must be at least 8 characters long" ||
      result.response == "This email is already in use"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else {
      apiSucessRes(
        res,
        CrudMessage.USER_CREATED,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    }
  } catch (error) {
    console.log(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await userServices.loginUser(req, res);
    if (result.response == "User not found") {
      apiErrorres(res, result.response, ServerStatusCode.UNAUTHORIZED, true);
    } else if (result.response == "Invalid password") {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "User is not active") {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else {
      apiSucessRes(
        res,
        CrudMessage.LOGIN_SUCESS,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    }
  } catch (error) {
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const userInsert = async (req, res) => {
  try {
    const result = await userServices.userInsert(req,res);
    if (!result.response || result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.BAD_REQUEST, true);
    } else if (
      result.response === "User with this email already exists" ||
      result.response === "Company with this companyName already exists"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else {
      if (result.response === "User and Company Inserted successfully") {
        apiSucessRes(
          res,
          result.response,
          result.data,
          ServerStatusCode.SUCESS_CODE
        );
      } else {
        apiErrorres(res, result.response, ServerStatusCode.SERVER_ERROR, true);
      }
    }
  } catch (error) {
    console.log(error);
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await userServices.forgotPassword(req);
    if (result.response == "User not found") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else if (
      result.response === "Password reset email sent" ||
      result.data === true
    ) {
      apiSucessRes(
        res,
        CrudMessage.RESET_MAIL_SENT,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Error sending password reset email") {
      apiErrorres(res, result.response, ServerStatusCode.UNPROCESSABLE, true);
    }
  } catch (error) {
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await userServices.resetPassword(req, res);
    if (result.response == "Inavalid User or User not found") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else if (result.response === "Password reset successful") {
      apiSucessRes(
        res,
        CrudMessage.PASSWORD_RESET,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else {
      apiErrorres(
        res,
        errorResponse.NOT_AVALIABLE,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
  } catch (error) {
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};

const changePassword = async (req, res) => {
  try {
    const result = await userServices.changePassword(req, res);
    if (result.response === "Invalid Current Password") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else if (result.response === "User for this mail-id not exist") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else if (result.response === "Password Change Sucessfully") {
      apiSucessRes(
        res,
        CrudMessage.PASSWORD_RESET,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    } else if(result.response == 'User Dont Have Permision To Chnage Password Without Current Password'){
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.PRECONDITION_FAILED,
        true
      );
    }
     else {
      apiErrorres(
        res,
        errorResponse.NOT_AVALIABLE,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
  } catch (error) {
    apiErrorres(
      res,
      errorResponse.SOMETHING_WRONG,
      ServerStatusCode.SERVER_ERROR,
      true
    );
  }
};
const varifyTokenForForgetPassword = async (req, res) => {
  try {
    const result = await userServices.varifyTokenForForgetPassword(req, res);
    if (result.response === "Invalid reset token") {
      apiErrorres(res, result.response, ServerStatusCode.INVALID_CRED, true);
    } else if (result.response === "Token varified sucessfully") {
      apiSucessRes(res, result.response, true, ServerStatusCode.SUCESS_CODE);
    } else {
      apiErrorres(res, result.response, ServerStatusCode.INVALID_CRED, true);
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.INVALID_CRED, true);
  }
};

const addUser = async (req, res) => {
  try {
    const result = await userServices.addUser(req, res);
    if (!result.response && result.isSometingMissing) {
      apiErrorres(res, result.data, ServerStatusCode.BAD_REQUEST, true);
    } else if (result.response === "New User Created Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "User Not created sucessfully") {
      apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    } else if (result.response === "User with this email already exists") {
      apiErrorres(res, result.response, ServerStatusCode.ALREADY_EXIST, true);
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.NOT_EXIST_CODE,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.BAD_REQUEST, true);
  }
};

const editUser = async (req, res) => {
  try {
    const result = await userServices.editUser(req, res);
    if (result.response === "User details updated sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "Failed to update User details") {
      apiErrorres(res, result.response, ServerStatusCode.RECORD_NOTEXIST, true);
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.UNAUTHORIZED, true);
  }
};

const getUser = async (req, res) => {
  try {
    const result = await userServices.getUser(req, res);
    if (result.response === "User data found SucessFully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "User data not found") {
      apiErrorres(res, result.response, ServerStatusCode.RECORD_NOTEXIST, true);
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.UNAUTHORIZED, true);
  }
};

const getAllAgencyAndDistributer = async (req,res) => {
  try{
    let result = await userServices.getAllAgencyAndDistributer(req,res);
    if (result.response === "Agency Data fetch Sucessfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response === "No Agency with this TMC") {
      apiErrorres(res, result.response, ServerStatusCode.RECORD_NOTEXIST, true);
    }else if (result.response === "Agency Data not found") {
      apiErrorres(res, result.response, ServerStatusCode.RECORD_NOTEXIST, true);
    } 
    else{
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }

  }catch(error){
    apiErrorres(res, error, ServerStatusCode.UNAUTHORIZED, true);
     
  }
}


const userStatusUpdate=async(req,res)=>{
  try{
    const result=await userServices.updateUserStatus(req,res)
if(result.response==="Upate Successfully"){
  apiSucessRes(
    res,
    result.response,
    result.data,

    ServerStatusCode.SUCESS_CODE
  );
}
else if(result.response==="User data not found"){
  apiErrorres(res, result.response, ServerStatusCode.NOT_EXIST_CODE, true);
}
else {
  apiErrorres(
    res,
    errorResponse.SOME_UNOWN,
    ServerStatusCode.RESOURCE_NOT_FOUND,
    true
  );
}

  }
  catch(error){
    apiErrorres(res, error, ServerStatusCode.UNAUTHORIZED, true);

  }
}

const getCompanyProfle=async(req,res)=>{
  try{
    const result=await userServices.getCompanyProfle(req,res)
    if(result.response==="Company data find successfull"){
      apiSucessRes(
        res,
        result.response,
        result.data,
    
        ServerStatusCode.SUCESS_CODE
      );
    }
    else if(result.response==="Company Data not Found"){
      apiErrorres(res, result.response, ServerStatusCode.NOT_EXIST_CODE, true);
    }
    else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
    
    
  }catch(error){
    apiErrorres(res, error, ServerStatusCode.UNAUTHORIZED, true);

  }
}


const updateCompayProfile=async(req,res)=>{
try{
  const result=await userServices.updateCompayProfile(req,res)
    if(result.response==="company data succefully update"){
      apiSucessRes(
        res,
        result.response,
        result.data,
    
        ServerStatusCode.SUCESS_CODE
      );
    }
    else if(result.response==="company data not update"){
      apiErrorres(res, result.response, ServerStatusCode.NOT_EXIST_CODE, true);
    }
    else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
      );
    }
    
  }catch(error){
    console.log(error)
    apiErrorres(res, error, ServerStatusCode.UNAUTHORIZED, true);

  }
}
module.exports = {
  registerUser,
  loginUser,
  userInsert,
  forgotPassword,
  resetPassword,
  changePassword,
  varifyTokenForForgetPassword,
  addUser,
  editUser,
  getUser,
  getAllAgencyAndDistributer,
  userStatusUpdate,
  getCompanyProfle,
  updateCompayProfile
  
};
