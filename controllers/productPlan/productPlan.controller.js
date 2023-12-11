const ProductPlanServices = require("./productPlan.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

// hjghjjjgj
// product plan store
const addProductPlan = async (req, res) => { 
  try {
    const result = await ProductPlanServices.addProductPlan(req);
    if (
      result.response == "Compnay id does not exist" ||
      result.response == "Product plan name already exist"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else {
      apiSucessRes(
        res,
        CrudMessage.PRODUCT_PLAN_CREATED,
        result.response,
        ServerStatusCode.SUCESS_CODE
      );
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: error.message, data: null });
  }
};

const getAllProductPlan = async (req, res) => {
  try {
    const result = await ProductPlanServices.getAllProductPlan(req);

    if (result.response == "Product Plan Fetch Sucessfull") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Product Plan Not Found") {
      apiErrorres(res, result.response, ServerStatusCode.RESOURCE_NOT_FOUND, true);
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.NOT_EXIST_CODE,
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

const productPlanUpdateById = async (req, res) => {
  try {
    const result = await ProductPlanServices.productPlanUpdateById(req);
    if (
      result.response == "product plan name fields are required" ||
      result.response == "Product plan id not found" ||
      result.response == "Product plan name already exist"
    ) {
      apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true);
    } else {
      apiSucessRes(
        res,
        CrudMessage.PRODUCT_PLAN_UPDATED,
        result.response,
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



const getAllProductPlanDetail = async (req, res) => {
  try {
    const result = await ProductPlanServices.getAllProductPlanDetail(req);
    if (result.response == "Product Plan Fetch Successfully") {
      apiSucessRes(
        res,
        result.response,
        result.data,
        ServerStatusCode.SUCESS_CODE
      );
    } else if (result.response == "Product Plan Not Found") {
      apiErrorres(res, result.response, ServerStatusCode.RESOURCE_NOT_FOUND, true);
    } else {
      apiErrorres(
        res,
        errorResponse.SOME_UNOWN,
        ServerStatusCode.NOT_EXIST_CODE,
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

module.exports = {
  addProductPlan,
  getAllProductPlan,
  productPlanUpdateById,
  getAllProductPlanDetail
};
