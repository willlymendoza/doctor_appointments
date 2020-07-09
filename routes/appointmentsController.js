const express = require("express");
const { Types } = require("mongoose");
const Appointment = require("../models/AppointmentModel");
const router = express.Router();
const { body, validationResult } = require("express-validator");

/* GETTING LIST OF APPOINTMENTS */
router.get("/", async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient")
    .populate("doctor")
    .populate("created_by");

  if (!appointments.length)
    return res.status(404).send("Appointments not found");

  res.send(appointments);
});

/* GETTING AN APPOINTMENT BY ID */
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
  const appointment = new Appointment();
  const data = req.body;

  appointment.appointment_date = data.appointment_date;
  appointment.hour = data.hour;
  appointment.patient = data.patient_id;
  appointment.doctor = data.doctor_id;
  appointment.created_by = "5f0667fb5aa2b45df4dfaeca";
  appointment.is_finished = false;
  appointment.updated_at = Date.now();

  await appointment.save();

  res.status(201).send(appointment);
});

/* UPDATING AN APPOINTMENT */
router.put("/:id", async (req, res) => {
  const data = req.body;

  const validId = Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID param is invalid");

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
