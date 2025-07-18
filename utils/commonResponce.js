const apiSucessRes = (res, message, result, code, apiReq, error, token, refreshToken, expireTime) =>  {
     res.removeHeader("X-Powered-By"); // only use certification 
    return res.status(code).json({
        IsSucess: true,
        ResponseStatusCode: code,
        Message: message,
        Result: result,
        ApiReq : apiReq,
        Error: error,
        Token: token,
        RefreshToken : refreshToken,
        ExpireTime : expireTime,

    })

};

const apiSucessResforAgency = (res, message, result, count ,code) =>  {
    res.removeHeader("X-Powered-By"); // only use certification 
    return res.status(code).json({
        IsSucess: true,
        ResponseStatusCode: code,
        Message: message,
        Result: result,
        totalCount : count

    })

};
const apiErrorres = (res,message,code, error) => {
     res.removeHeader("X-Powered-By"); // only use certification 
    return res.status(code).json({
        IsSucess : false,
        Message: message,
        ResponseStatusCode : code,
        Error: error
    })
}
const status = {
    1 : "Active",
    2 : "InActive",
    3 : "Pending",

}

module.exports = {
    apiSucessRes,
    apiErrorres,
    status,
    apiSucessResforAgency
}