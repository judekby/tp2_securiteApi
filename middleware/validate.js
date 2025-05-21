const Validator = require('better-validator');

const validateUserInput = (req, res, next) => {
  const validator = new Validator();
  validator(req.body.username).isString().isLength(3, 30);
  validator(req.body.password).isString().isLength(6, 100);

  const result = validator.run();

  if (result.length > 0) {
    return res.status(400).json({ errors: result });
  }

  next();
};

module.exports = validateUserInput;