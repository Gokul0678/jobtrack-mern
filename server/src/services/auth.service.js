const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { sign } = require("../utils/token");

const result = (user) => ({
  token: sign(user._id),
  user: { name: user.name, email: user.email },
});

exports.register = async ({ name, email, password }) => {
  if (!email || !password || password.length < 6) {
    throw new ApiError(
      400,
      "Email and a password of 6+ characters are required",
    );
  }
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });
  return result(user);
};

exports.login = async ({ email = "", password = "" }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  return result(user);
};
