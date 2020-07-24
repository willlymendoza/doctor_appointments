const auth = require("../middlewares/authMiddleware");
const express = require("express");
const { Types } = require("mongoose");
const Appointment = require("../models/AppointmentModel");
const Patient = require("../models/PatientModel");
const User = require("../models/UserModel");
const {
  createValidation,
  updateValidation,
} = require("../validations/appointmentValidations");
const router = express.Router();

/* GETTING LIST OF APPOINTMENTS */
router.get("/", auth, async (req, res) => {
  const appointments = await Appointment.find()
    .select("appointment_date hour is_finished")
    .populate({ path: "patient", select: "first_name last_name" })
    .populate({ path: "doctor", select: "name last_name" });

  if (!appointments.length)
    return res.status(404).send("Appointments not found");

  res.send(appointments);
});

/* GETTING AN APPOINTMENT BY ID */
router.get("/:id", auth, async (req, res) => {
  const validId = Types.ObjectId.isValid(req.params.id);

  if (!validId) return res.status(400).send("The ID param is invalid");

  const appointment = await await Appointment.findById(req.params.id)
    .populate("patient")
    .populate("doctor")
    .populate("created_by");

  if (!appointment) {
    res.status(404).send("Appointment not found");
    return;
  }

  res.send(appointment);
});

/* CREATING A NEW APPOINTMENT */
router.post("/", auth, async (req, res) => {
  const validDoctorId = Types.ObjectId.isValid(req.body.doctor_id);
  if (!validDoctorId)
    return res.status(400).send("The doctor_id param is invalid");

  const validPatientId = Types.ObjectId.isValid(req.body.patient_id);
  if (!validPatientId)
    return res.status(400).send("The patient_id param is invalid");

  const patient = await Patient.findById(req.body.patient_id);
  if (!patient) return res.status(400).send("This patient doesnt exist");

  const doctor = await User.findById(req.body.doctor_id);
  if (!doctor) return res.status(400).send("This doctor doesnt exist");

  const { error } = createValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const appointment = new Appointment({
    appointment_date: req.body.appointment_date,
    hour: req.body.hour,
    patient: req.body.patient_id,
    doctor: req.body.doctor_id,
    created_by: "5f0667fb5aa2b45df4dfaeca",
    is_finished: false,
    updated_at: Date.now(),
  });

  try {
    await appointment.save();
    res.send(appointment);
  } catch (error) {
    res.status(400).send(error);
  }
});

/* UPDATING AN APPOINTMENT */
router.put("/:id", auth, async (req, res) => {
  const validId = Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID param is invalid");

  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = req.body;
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      appointment_date: data.appointment_date,
      hour: data.hour,
      observations: data.observations,
      prescription: data.prescription,
      is_finished: false,
      updated_at: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!appointment) {
    return res.status(404).send(`This appointment doesn't exist`);
  }

  res.status(200).send(appointment);
});

module.exports = router;
