const mongoose = require("mongoose");
const express = require("express");
const app = express();

/* IMPORTING ROUTES */
const patients = require("./routes/patientsController");

app.use(express.json());
app.use("/api/patients/", patients);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

mongoose
  .connect("mongodb://localhost/doctor_appointments", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log(`Can't connect to mongo db`));
