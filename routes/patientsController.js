const express = require("express");
const Patient = require("../models/PatientModel");
const { Types } = require("mongoose");

const router = express.Router();
const { body, validationResult } = require("express-validator");

/* LIST OF PATIENTS */
router.get("/", async (req, res) => {
  const users = await Patient.find();
  res.send(users);
});

/* SEARCH PATIENT BY ID */
router.get("/:id", async (req, res) => {
  const validId = Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID param is invalid");

  const patient = await Patient.findById(req.params.id);

  if (!patient) return res.status(404).send("Patient not found");

  res.send(patient);
});

/* CREATE NEW PATIENT */
router.post(
  "/",
  [
    body("first_name").trim().isLength({ min: 5, max: 55 }),
    body("last_name").trim().isLength({ min: 5, max: 55 }),
    body("personal_document_id").trim().isLength({ min: 5, max: 55 }),
    body("phone_number").trim().isLength({ min: 8, max: 25 }),
    body("email").trim().isEmail(),
    body("city").trim().isLength({ min: 3, max: 40 }),
    body("address").trim().isLength({ min: 5, max: 60 }),
    body("sex").trim().isLength({ min: 1, max: 3 }),
    body("age").trim().isInt({ min: 1, max: 150 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

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
  }
);

/* UPDATING PATIENT */
router.put(
  "/:id",
  [
    body("first_name").trim().isLength({ min: 5, max: 55 }),
    body("last_name").trim().isLength({ min: 5, max: 55 }),
    body("personal_document_id").trim().isLength({ min: 5, max: 55 }),
    body("phone_number").trim().isLength({ min: 8, max: 25 }),
    body("email").trim().isEmail(),
    body("city").trim().isLength({ min: 3, max: 40 }),
    body("address").trim().isLength({ min: 5, max: 60 }),
    body("sex").trim().isLength({ min: 1, max: 3 }),
    body("age").trim().isInt({ min: 1, max: 150 }),
  ],
  async (req, res) => {
    const validId = Types.ObjectId.isValid(req.params.id);
    if (!validId) return res.status(400).send("The ID param is invalid");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

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
  }
);

module.exports = router;
