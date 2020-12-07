const express = require('express');
const morgan = require("morgan");
require('dotenv').config()

const app = express();

// MIDDLEWARES
app.use(express.json()); // Body parser
app.use(morgan("tiny"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// ROUTES
app.use("/api/account", require("./routes/account"));

// ERRORS
app.use((req, res, next) => {
  throw new Error("Could not find this route.");
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const PORT = process.env.PORT || '3000';

app.listen(PORT, () => {
  console.log(`Server running on port ${ PORT}`)
})
