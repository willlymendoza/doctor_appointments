const auth = require("../middlewares/authMiddleware");
const bcrypt = require("bcrypt");
const express = require("express");
const { Types } = require("mongoose");
const User = require("../models/UserModel");
const {
  registerValidation,
  updateValidation,
} = require("../validations/userValidations");
const router = express.Router();

/* GETTING LIST OF USERS */
router.get("/", auth, async (req, res) => {
  if (req.query.isDoctor && parseInt(req.query.isDoctor) === 1) {
    const users = await User.find({ is_doctor: true }).select("name last_name");

    if (!users.length) return res.status(404).send("Users not found");

    res.send(users);
  } else {
    const users = await User.find().populate("created_by");

    if (!users.length) return res.status(404).send("Users not found");

    res.send(users);
  }
});

/* GETTING A USER BY ID */
router.get("/:id", auth, async (req, res) => {
  const validId = Types.ObjectId.isValid(req.params.id);

  if (!validId) return res.status(400).send("The ID param is invalid");

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.send(user);
});

/* CREATING A NEW USER */
router.post("/", auth, async (req, res) => {
  /* Checking if the user is already in the DB */
  const emailExist = await User.findOne({
    email: req.body.email,
  });
  if (emailExist) return res.status(400).send("Email already exists");

  /* Validation data */
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  /* Hashing password */
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const data = req.body;

  const user = new User({
    name: data.name,
    last_name: data.last_name,
    phone_number: data.phone_number,
    email: data.email,
    address: data.address,
    is_doctor: data.is_doctor,
    password: hashPassword,
    created_by: req.user._id,
    updated_at: Date.now(),
  });

  try {
    const savedUser = await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

/* UPDATING A USER */
router.put("/:id", auth, async (req, res) => {
  const validId = Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(400).send("The ID param is invalid");

  /* Validation data */
  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: data.name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      email: data.email,
      address: data.address,
      is_doctor: data.is_doctor,
      updated_at: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return res.status(404).send(`This user doesn't exist`);
  }

  res.status(200).send(user);
});

module.exports = router;
