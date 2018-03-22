const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("./routes")());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  res.send(404);
});

// error handler
app.use((err, req, res, next) => {
  console.log(err.message);
  res.sendStatus(err.status || 500);
});

module.exports = app;