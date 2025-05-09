const Auth = require("../models/auth.model");
const bcrypt = require('bcryptjs');
const { generateToken } = require("../utils/helper");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await Auth.findOne({ email });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email. Please register."
      });
    }

    const isPasswordMatching = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatching) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password."
      });
    }

    const responseData = {
      id: userData._id,
      name: userData.name,
      email: userData.email
    };

    const token = generateToken(userData._id, userData.email);

    res.status(200).json({
      success: true,
      data: responseData,
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later."
    });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingData = await Auth.findOne({ email });

    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Email already exists! Please use a different one."
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userDetails = await Auth.create({ name, email, password: hashedPassword });

    const responseData = {
      id: userDetails._id,
      name: userDetails.name,
      email: userDetails.email
    };

    const token = generateToken(userDetails._id, userDetails.email);

    res.status(201).json({
      success: true,
      data: responseData,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again later."
    });
  }
};

module.exports = { login, register };