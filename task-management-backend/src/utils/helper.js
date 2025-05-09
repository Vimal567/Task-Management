const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '4h' });
};

module.exports = { generateToken };