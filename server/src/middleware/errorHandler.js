// Central error handler: converts any error into a consistent JSON response
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Server error";

  if (err.code === 11000) {
    status = 409;
    message = "Email already registered";
  } else if (err.name === "ValidationError") status = 400;
  else if (err.name === "CastError") {
    status = 400;
    message = "Invalid id";
  }

  if (status === 500) console.error(err);
  res.status(status).json({ message });
};
