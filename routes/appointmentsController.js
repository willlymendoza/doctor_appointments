const auth = require("../middlewares/authMiddleware");
const express = require("express");
const { Types } = require("mongoose");
const { ymdDateFromFormat, ymdDateToFormat } = require("../helpers/dateFormat");
const Appointment = require("../models/AppointmentModel");
const Patient = require("../models/PatientModel");
const User = require("../models/UserModel");
const {
  createValidation,
  updateValidation,
} = require("../validations/appointmentValidations");
const router = express.Router();

const moment = require("moment");

/* GETTING LIST OF APPOINTMENTS */
router.get("/", auth, async (req, res) => {
  const appointments = await Appointment.find()
    .select("appointment_date hour is_finished patient_id doctor_id")
    .populate({
      path: "patient",
      select: "first_name last_name",
    })
    .populate({ path: "doctor", select: "name last_name" });

  if (!appointments.length)
    return res.status(404).send("Appointments not found");

  res.send(appointments);
});

/* LIST OF RECENT ADDED APPOINTMENTS */
router.get("/recent/:limit", auth, async (req, res) => {
  const recentAppointments = await Appointment.find()
    .select("appointment_date hour patient_id doctor_id")
    .populate({ path: "patient", select: "first_name last_name" })
    .populate({ path: "doctor", select: "name last_name" })
    .sort({ created_at: "desc" })
    .limit(parseInt(req.params.limit));

  res.send(recentAppointments);
});

router.get("/total", auth, async (req, res) => {
  const total = await Appointment.countDocuments();

  res.send({ total });
});

router.get("/today", auth, async (req, res) => {
  const dateFrom = ymdDateFromFormat();
  const dateTo = ymdDateToFormat();

  const total = await Appointment.find({
    appointment_date: { $gte: dateFrom, $lte: dateTo },
  }).countDocuments();

  res.send({ total });
});

router.get("/patient/:id", auth, async (req, res) => {
  const appointments = await Appointment.find({
    patient_id: req.params.id,
  }).select("appointment_date hour");

  res.send(appointments);
});

/* GETTING AN APPOINTMENT BY ID */
router.get("/:id", auth, async (req, res) => {
  const validId = Types.ObjectId.isValid(req.params.id);

  if (!validId) return res.status(400).send("The ID param is invalid");

  const appointment = await Appointment.findById(req.params.id)
    .select(
      "appointment_date hour observations prescription is_finished patient_id doctor_id"
    )
    .populate({
      path: "patient",
      select:
        "first_name last_name personal_document_id phone_number email city address sex age",
    })
    .populate({ path: "doctor", select: "name last_name" });

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
    appointment_date: ymdDateFromFormat(req.body.appointment_date),
    hour: req.body.hour,
    patient_id: req.body.patient_id,
    doctor_id: req.body.doctor_id,
    observations: req.body.observations,
    created_by_id: req.user._id,
    is_finished: false,
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
      appointment_date: ymdDateFromFormat(data.appointment_date),
      hour: data.hour,
      observations: data.observations,
      prescription: data.prescription,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
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
