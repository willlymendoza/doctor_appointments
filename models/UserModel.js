const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 55,
  },
  last_name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 55,
  },
  phone_number: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 25,
  },
  email: {
    type: String,
    minlength: 8,
    maxlength: 25,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60,
  },
  is_doctor: {
    type: Boolean,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 150,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
