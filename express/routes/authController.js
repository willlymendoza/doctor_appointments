const bcrypt = require("bcryptjs");
const express = require("express");
const User = require("../models/UserModel");
const router = express.Router();
const { loginValidation } = require("../validations/userValidations");

router.post("/", async (req, res) => {
  /* Validating data */
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  /* Checking if the email exists */
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid User/Password");

  /* Validation password */
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send("Invalid User/Password");

  const jwtToken = user.generateJWT();

  res.status(200).header("Authorization", jwtToken).send({
    _id: user.id,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    is_doctor: user.is_doctor,
  });
});

module.exports = router;
