const auth = require("../middlewares/authMiddleware");
const bcrypt = require("bcrypt");
const express = require("express");
const { Types } = require("mongoose");
const User = require("../models/UserModel");
const router = express.Router();
const { body, validationResult } = require("express-validator");

/* GETTING LIST OF USERS */
router.get("/", auth, async (req, res) => {
  const users = await User.find().populate("created_by");

  if (!users.length) return res.status(404).send("Users not found");

  res.send(users);
});

/* GETTING A USER BY ID */
router.get("/:id", async (req, res) => {
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
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 5, max: 55 }),
    body("last_name").trim().isLength({ min: 5, max: 55 }),
    body("phone_number").trim().isLength({ min: 8, max: 25 }),
    body("email").trim().isEmail(),
    body("address").trim().isLength({ min: 5, max: 60 }),
    body("is_doctor").trim().isBoolean(),
    body("password").trim().isLength({ min: 8, max: 25 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = new User();
    const data = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user.name = data.name;
    user.last_name = data.last_name;
    user.phone_number = data.phone_number;
    user.email = data.email;
    user.address = data.address;
    user.is_doctor = data.is_doctor;
    user.password = hashPassword;
    user.created_by = "5f0667fb5aa2b45df4dfaeca";
    user.updated_at = Date.now();

    await user.save();

    res.status(201).send(user);
  }
);

/* UPDATING A USER */
router.put(
  "/:id",
  [
    body("name").trim().isLength({ min: 5, max: 55 }),
    body("last_name").trim().isLength({ min: 5, max: 55 }),
    body("phone_number").trim().isLength({ min: 8, max: 25 }),
    body("email").trim().isEmail(),
    body("address").trim().isLength({ min: 5, max: 60 }),
    body("is_doctor").trim().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const data = req.body;

    const validId = Types.ObjectId.isValid(req.params.id);
    if (!validId) return res.status(400).send("The ID param is invalid");

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
  }
);

module.exports = router;
