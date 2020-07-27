const auth = require("../middlewares/authMiddleware");
const express = require("express");
const Patient = require("../models/PatientModel");
const { Types } = require("mongoose");
const {
  createValidation,
  updateValidation,
} = require("../validations/patientValidations");
const { populate } = require("../models/PatientModel");

const router = express.Router();

/* LIST OF PATIENTS */
router.get("/", auth, async (req, res) => {
  const patients = await Patient.find().select(
    "first_name last_name personal_document_id phone_number email city address sex age"
  );
  res.send(patients);
});

/* LIST OF RECENT ADDED PATIENTS */
router.get("/recent/:limit", auth, async (req, res) => {
  const recentPatients = await Patient.find()
    .select("first_name last_name email created_at")
    .sort({ created_at: "desc" })
    .limit(parseInt(req.params.limit));

  res.send(recentPatients);
});

router.get("/total", auth, async (req, res) => {
  const total = await Patient.countDocuments();

  res.send({ total });
});

/* SEARCH PATIENT BY ID */
router.get("/:id", auth, async (req, res) => {
  const validId = Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID param is invalid");

  const patient = await Patient.findById(req.params.id).select(
    "first_name last_name personal_document_id phone_number email city address sex age"
  );

  if (!patient) return res.status(404).send("Patient not found");

  res.send(patient);
});

/* CREATE NEW PATIENT */
router.post("/", auth, async (req, res) => {
  const { error } = createValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await Patient.findOne({
    email: req.body.email,
  });
  if (emailExist) return res.status(400).send("Email already exists");

  const patient = new Patient({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    personal_document_id: req.body.personal_document_id,
    phone_number: req.body.phone_number,
    email: req.body.email,
    city: req.body.city,
    address: req.body.address,
    sex: req.body.sex,
    age: req.body.age,
    created_by_id: req.user._id,
    updated_at: Date.now(),
  });

  try {
    await patient.save();
    res.send(patient);
  } catch (error) {
    res.status(400).send(error);
  }
});

/* UPDATING PATIENT */
router.put("/:id", auth, async (req, res) => {
  const validId = Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID param is invalid");

  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
