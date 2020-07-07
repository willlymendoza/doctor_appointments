const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  first_name: {
    type: String,
    minlength: 5,
    maxlength: 55,
    required: true,
  },
  last_name: {
    type: String,
    minlength: 5,
    maxlength: 55,
    required: true,
  },
  personal_document_id: {
    type: String,
    minlength: 5,
    maxlength: 55,
    required: true,
  },
  phone_number: {
    type: String,
    minlength: 8,
    maxlength: 25,
  },
  email: {
    type: String,
    minlength: 8,
    maxlength: 25,
  },
  city: {
    type: String,
    minlength: 3,
    maxlength: 40,
    required: true,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60,
  },
  sex: {
    type: String,
    minlength: 1,
    maxlength: 3,
    required: true,
  },
  age: {
    type: Number,
    min: 1,
    max: 150,
    required: true,
  },
  created_by_id: {
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
    default: Date.now(),
  },
});

const Patient = mongoose.model("patient", patientSchema);

module.exports = Patient;
