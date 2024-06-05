const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

module.exports = function (req, res, next) {
  const tokenWithBearer = req.header("Authorization");

  if (!tokenWithBearer) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("Access Denied: No Token Provided!");
  }

  const token = tokenWithBearer.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.token = decoded;
    req.header.authorization = req.header("Authorization");
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Access Denied: Token Expired");
    }
    res.status(StatusCodes.UNAUTHORIZED).send("Access Denied: Invalid Token!");
  }
};
