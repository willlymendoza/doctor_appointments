const mongoose = require("mongoose");
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

/* IMPORTING ROUTES */
const patients = require("./routes/patientsController");
const users = require("./routes/usersController");
const appointments = require("./routes/appointmentsController");
const auth = require("./routes/authController");

const corsOptions = {
  exposedHeaders: "Authorization",
};

dotenv.config();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/.netlify/functions/api/patients/", patients);
app.use("/.netlify/functions/api/users/", users);
app.use("/.netlify/functions/api/appointments/", appointments);
app.use("/.netlify/functions/api/auth/", auth);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on 127.0.0.1:${port}`));

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log(`Can't connect to mongo db`));

//
module.exports = app;
module.exports.handler = serverless(app);
