const apiSucessRes = (res, message, result, code, apiReq, error, token, refreshToken, expireTime,) =>  {
    
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

const apiErrorres = (res,message,code, error) => {
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
    status
}