const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
  },
  {
    timestamps: true
  }
);

const Auth = mongoose.model('auth', authSchema);

module.exports = Auth;