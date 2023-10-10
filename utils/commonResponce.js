const apiSucessRes = (res, message, result, code, error, token, refreshToken, expireTime) =>  {
    return res.status(code).json({
        IsSucess: true,
        ResponseStatusCode: code,
        Message: message,
        Result: result,
        Error: error,
        Token: token,
        RefreshToken : refreshToken,
        ExpireTime : expireTime

    })

};

const apiErrorres = (res,message,code, error) => {
    return res.status(code).json({
        IsSucess : false,
        Message: message,
        ResponseStatusCode : code,
        Error: error,

    })
}

module.exports = {
    apiSucessRes,
    apiErrorres
}