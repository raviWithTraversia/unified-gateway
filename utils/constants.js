const ServerStatusCode = {
    NOT_EXIST_CODE: 403,
    UNAUTHORIZED: 401,
    SUCESS_CODE: 200,
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    INVALID_CRED: 403,
    BAD_REQUEST: 400,
    PRECONDITION_FAILED: 412,
    UNPROCESSABLE: 422,
    RESOURCE_NOT_FOUND: 404,
    ALREADY_EXIST: 208,
    CONTENT_NOT_FOUND: 204

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
    PAYU_REQUEST_RESPONCE : 'PayU created successfully',
    TOPUP_REQUESTED_CREATED : 'Topup request created successfully',
    WEBSIET_MANAGER_CREATED : 'Website manager created successfully',
    PRIVILAGE_PLAN_UPDATE : 'Privilage plan updated successfully',
    PRIVILAGE_PLAN_ISDEFAULT : 'Privilage plan IsDefault assign successfully',
    OTP_EMAIL : 'Otp send',
    OTP_VARIFIED : 'OTP verified sucessfully',
    AIR_COMMERCIAL_ADD : 'Air commerical created successfully',
    ROLE_HAS_PERMISSION_CREATE : 'Role has permission created successfully',
    ROLE_HAS_PERMISSION_UPDATE : 'Role has permission updated successfully',
    CREDIT_APPROVE :  'Credit request approved successfully',
    DEPOSIT_APPROVE :  'Deposit request approved successfully',
    CREDIT_REJECTED :  'Credit request rejected successfully',
    DEPOSIT_REJECTED :  'Deposit request rejected successfully',
    CREATE_PLBMASTER : 'created PLB master successfully',
    UPDATE_PLBMASTER :  'Updated PLB master successfully',
    DELETE_PLBMASTER :  'deleted PLB master successfully',  
    COPY_PLB : 'Copy PLB Master successfully',
    PLBGROUP_CREATE : 'PLB Group master added successfully',
    LAYOUT_COUNT : 'Layout count fetch sucessfully ',
    PLBGROUP_UPDATE : 'PLB Group master updated successfully',
    PLBGROUP_DELETE : 'PLB Group master deleted successfully',
    CREATE_INCENTIVE_MASTER : 'created incentive master successfully',
    UPDATE_INCENTIVE_MASTER :  'Updated incentive master successfully',
    COPY_INCENTIVE_MASTER : 'Copy incentive Master successfully',
    DELETE_INCENTIVE_MASTER : 'Deleted incentive Master successfully',
    INCGROUP_CREATE : 'incentive Group master added successfully',
    INCGROUP_UPDATE : 'incentive Group master updated successfully',
    INCGROUP_DELETE : 'incentive Group master deleted successfully',
    PAN_DATA: 'Data retrvee sucessfully',
    IMAGE_UPLOAD: 'Image Uploded',
    IMAGE_UPLOAD_FETCH: 'Image Uploded Fetch',
    IMAGE_UPLOAD_UPDATED: 'Upload image is updated',
    IMAGE_UPLOAD_DELETED: 'Upload image is deleted',
    PERMISSION_CREATE : 'Permission created successfully',
    MATRIX_UPDATE : 'Matrix updated successfully',
    COMMERCIAL_FILTER : 'Commercial updated successfully',
    COMMERCIAL_DELETE : 'Air Commercial delete successfully',
    PLB_MASTER_IS_DEFAULT : 'Plb define as default',
    PLB_GROUP_MASTER_IS_DEFINE_DEFAULT : 'PLB group master is define default',
    INCENTIVE_MASTER_IS_DEFAULT : 'incentive master define as default',
    INCENTIVE_GROUP_MASTER_IS_DEFINE_DEFAULT : 'Incentive group master is define default',

}

const errorResponse = {
    NOT_FOUND : 'User not found',
    IS_EXIST : 'This email is already in use',
    ALL_FEILD_REQUIRED : 'All feild are required to filed',
    INVALID_REQ : 'Invalid Request',
    USER_NOT_INSERT : 'User data not inserted',
    SOMETHING_WRONG: 'Something went wrong!',
    NOT_AVALIABLE: 'No data available',
    SOME_UNOWN : "Some Unhandle error"

}
const Status = {
    "Active" : "Active",
    "InActive" : "InActive",
    "Pending" : "Pending",
    "Inactive" : "Inactive"

}
const ADMIN_USER_TYPE = ['MASTER', 'COMPANY', 'SUB_COMPANY', 'EMPLOYEE'];

const TMC_ROLE= {
  Agency : "Agency",
  Distrbuter : "Distributer",
  Supplier : "Supplier"
};

const DISTRIBUTER_ROLE = {
   Agency : "Agency",
   Staff : "Staff"
};

const HOST_ROLE = {
    TMC : "TMC",
    DISTRIBUTER : "Distributer",
    AGENCY : "Agency"
};
const OTP_FOR = {
    "Mail": "Email",
    "Phone" : "Phone"
};
const OTP_TYPE = {
    "Reg" : 'Registration',
    "Login": 'Login'
};
const RabbitMQTopicQueue = {
    PAYMENT_REQUEST : "kafila/agent/payment/request",
  }
  
module.exports = {
    ServerStatusCode,
    errorResponse,
    ADMIN_USER_TYPE,
    CrudMessage,
    Status,
    TMC_ROLE,
    DISTRIBUTER_ROLE,
    HOST_ROLE,
    OTP_FOR,
    OTP_TYPE,
    RabbitMQTopicQueue
}