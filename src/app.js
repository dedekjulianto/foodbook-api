require("dotenv").config();

const cors = require("cors");
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


const index = require("./api");
const foods = require("./api/foods");
const accounts = require("./api/accounts");
// const accounts = require("./api/accounts")
// const settings = require("./api/settings")

const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/api", index);
app.use("/accounts", accounts);
app.use("/foods", foods);

mongoose.Promise = global.Promise; // native Node.js promise
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
