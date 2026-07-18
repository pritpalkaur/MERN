const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  console.log("🔑 Generating token for user ID:", userId);
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
