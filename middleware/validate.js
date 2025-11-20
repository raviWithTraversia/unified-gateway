const { validationResult } = require("express-validator");

module.exports.validateRQ = (req, res, next) => {
  let errors = validationResult(req);
  errors = [...new Set(errors.array().map((error) => error.path))];

  if (errors.length >= 1) {
    return res.status(400).json({
      IsSucess: false,
      Message: `Missing or invalid fields: ${errors.join(", ")}`,
      ResponseStatusCode: 500,
      Error: true,
    });
  }
  next();
};
