const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/UserModel");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  [
    body("email").trim().isEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("Invalid User/Password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) return res.status(400).send("Invalid User/Password");

    const jwtToken = user.generateJWT();

    res.status(201).header("Authorization", jwtToken).send({
      _id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      is_doctor: user.is_doctor,
    });
  }
);

module.exports = router;
