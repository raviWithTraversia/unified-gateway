const ServerStatusCode = {
    NOT_EXIST_CODE: 403,
    UNAUTHORIZED: 401,
    SUCESS_CODE: 200,
    SERVER_ERROR: 500,
    RECORD_NOTEXIST: 502,
    INVALID_CRED: 403,
    BAD_REQUEST: 400,
    PRECONDITION_FAILED: 412,
    UNPROCESSABLE: 422,
    RESOURCE_NOT_FOUND: 404,
    ALREADY_EXIST: 208

}

const CrudMessage = {
    USER_CREATED : 'User Register Sucessfully',
    LOGIN_SUCESS : 'User logedin Sucessfully',
    BOOKING_SUCESS : 'Booking Sucessfull',
    BOOKING_FAIL : 'Booking Failed',
    USER_INSERT : 'User data inserted sucessfully',
    RESET_MAIL_SENT : "Password reset mail sent",
    PASSWORD_RESET: 'Password reset sucessfully',
    FETCH_DATA : "Fetch all SMTP",
    ADD_SMTP : "Add smtp data",
    REMOVE_SMTP : "Remove smtp config sucessfully",
    ALL_DATA : "Fetch all data sucessfully",
    FETCH_REG_DATA: "Fetch all data by ComapnyId",
    PASSWORD_RESET: 'Password reset sucessfull',
    EVENT_LOG_CREATED : "Event log created successfully",
    PORTAL_LOG_CREATED : 'Portal log created successfully',
    PRODUCT_CREATED : 'Product addedd successfully',
    PRODUCT_UPDATE : 'Product updated sucessfully',
    PRODUCT_DELETE : 'Product deleted successfully',
    PRODUCT_PLAN_CREATED : 'Product plan created successfully',
    PRODUCT_PLAN_UPDATED : 'Product plan updated successfully',
    FETCH_DATA : "Fetch all SMTP",
    ADD_SMTP : "Add smtp data",
    REMOVE_SMTP : "Remove smtp config sucessfully",
    PRIVILAGE_PLAN_CREATED : 'Privilage plan created successfully',
    CREDIT_REQUESTED_CREATED : 'Credit request created successfully',
    WEBSIET_MANAGER_CREATED : 'Website manager created successfully',
    PRIVILAGE_PLAN_UPDATE : 'Privilage plan updated successfully',
    COMMERCIAL_AIR_PLAN : 'Commercial air plan created successfully',
    COMMERCIAL_AIR_PLAN_UPDATE : 'Commercial air plan updated successfully',
    COMMERCIAL_AIR_PLAN_ISDEFAULT : 'Commercial air plan define as IsDefault updated successfully',
    OTP_EMAIL : 'Otp send',
    OTP_VARIFIED : 'OTP varified sucessfully'
}

const errorResponse = {
    NOT_FOUND : 'User not found',
    IS_EXIST : 'This email is already in use',
    ALL_FEILD_REQUIRED : 'All feild are required to filed',
    INVALID_REQ : 'Invalid Request',
    USER_NOT_INSERT : 'User data not inserted',
    SOMETHING_WRONG: 'Something went wrong!',
    NOT_AVALIABLE: 'No data available'

}
const Status = {
    "Active" : "Active",
    "InActive" : "InActive",
    "Pending" : "Pending",

}

const ADMIN_USER_TYPE = ['MASTER', 'COMPANY', 'SUB_COMPANY', 'EMPLOYEE'];

module.exports = {
    ServerStatusCode,
    errorResponse,
    ADMIN_USER_TYPE,
    CrudMessage,
    Status
}