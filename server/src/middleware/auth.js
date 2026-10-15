const ApiError = require("../utils/ApiError");
const { verify } = require("../utils/token");

module.exports = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    req.userId = verify(token).id;
    next();
  } catch {
    next(new ApiError(401, "Unauthorized"));
  }
};
