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
    maxlength: 250,
    default: "",
  },
  prescription: {
    type: String,
    maxlength: 250,
    default: "",
  },
  patient_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  created_by_id: {
    type: Schema.Types.ObjectId,
    required: true,
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

appointmentSchema.virtual("patient", {
  ref: "patient",
  localField: "patient_id",
  foreignField: "_id",
  justOne: true,
});

appointmentSchema.virtual("doctor", {
  ref: "user",
  localField: "doctor_id",
  foreignField: "_id",
  justOne: true,
});

appointmentSchema.set("toObject", { virtuals: true });
appointmentSchema.set("toJSON", { virtuals: true });

const Appointment = mongoose.model("appointment", appointmentSchema);

module.exports = Appointment;
