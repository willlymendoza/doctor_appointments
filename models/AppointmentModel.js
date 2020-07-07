const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  appointment_date: {
    type: Date,
    required: true,
  },
  hour: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 10,
  },
  observations: {
    type: String,
    minlength: 5,
    maxlength: 250,
  },
  prescription: {
    type: String,
    minlength: 5,
    maxlength: 250,
  },
  patiend_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "patient",
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  created_by_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  is_finished: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
  },
});

const Appointment = mongoose.model("appointment", appointmentSchema);

module.exports = Appointment;