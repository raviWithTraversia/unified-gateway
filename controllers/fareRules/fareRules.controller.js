const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  ADMIN_USER_TYPE,
  CrudMessage,
} = require("../../utils/constants");
const fareRuleController = require("./fareRules.services");

const addfareRule = async (req, res) => {
  try {
    const result = await fareRuleController.addfareRule(req, res);
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
const getFareRule = async (req, res) => {
  try {
    const result = await fareRuleController.getFareRule(req, res);
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
const deleteFareRule = async (req, res) => {
  try {
    const result = await fareRuleController.deleteFareRule(req, res);
  } catch (error) {
    apiErrorres(res, error, ServerStatusCode.SERVER_ERROR, true);
  }
};
module.exports = {
  addfareRule,
  getFareRule,
  deleteFareRule,
};
