const jwt = require('jsonwebtoken');

exports.sign = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
exports.verify = (token) => jwt.verify(token, process.env.JWT_SECRET);
