const jwt = require("jsonwebtoken");
const { Config } = require("../configs/config");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ success: false, msg: "A token is required for authorization" });
    }

    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ success: false, msg: "Invalid token format" });
    }
  
    const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, Config.SECRET_JWT);
    req.user = decoded;
    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, msg: "Token is invalid or expired" });
  }
};

module.exports = verifyToken;
