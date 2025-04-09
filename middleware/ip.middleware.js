const rateLimit = require('express-rate-limit');
const panLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5, 
    message: {sucess:false,
      Message: "Too many requests from this IP, please try again later."
    }
  });

  module.exports={panLimiter}
  