const easeBuzzServices = require("./easeBuzz.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
    ServerStatusCode,
    errorResponse,
    CrudMessage,
} = require("../../utils/constants");

const easeBuzz = async (req, res) => {
    try {
        const result = await easeBuzzServices.easeBuzz(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        );
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
        );
    }
}
module.exports = {
    easeBuzz
};
