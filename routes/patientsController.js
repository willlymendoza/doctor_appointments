const express = require("express");
const Patient = require("../models/PatientModel");

const router = express.Router();
const { body, validationResult } = require("express-validator");

/* LIST OF PATIENTS */
router.get("/", async (req, res) => {
  const users = await Patient.find();
  res.send(users);
});

/* SEARCH PATIENT BY ID */
router.get("/:id", async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) return res.status(404).send("Patient not found");

  res.send(patient);
});

/* CREATE NEW PATIENT */
router.post("/", async (req, res) => {
  const patient = new Patient();

  patient.first_name = req.body.first_name;
  patient.last_name = req.body.last_name;
  patient.personal_document_id = req.body.personal_document_id;
  patient.phone_number = req.body.phone_number;
  patient.email = req.body.email;
  patient.city = req.body.city;
  patient.address = req.body.address;
  patient.sex = req.body.sex;
  patient.age = req.body.age;
  /* CHANGE THIS WHEN APLIYING USERS AUTH */
  patient.created_by_id = "5f0149db7c41292dec984f82";
  patient.updated_at = Date.now();

  await patient.save();

  res.status(201).send(patient);
});

/* UPDATING PATIENT */
router.put("/:id", async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      personal_document_id: req.body.personal_document_id,
      phone_number: req.body.phone_number,
      email: req.body.email,
      city: req.body.city,
      address: req.body.address,
      sex: req.body.sex,
      age: req.body.age,
      updated_at: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!patient) return res.status(404).send(`This patient doesn't exist`);

  res.status(200).send(patient);
});

module.exports = router;
