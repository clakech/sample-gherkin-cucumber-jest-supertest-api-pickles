const express = require("express");
const api = require("./middleware");

module.exports = () => {
  const app = new express.Router();

  app.post("/registration", api.register);
  app.post("/event", api.event);
  app.get("/interventionPlan", api.intervention);
  app.get("/heroes", api.heroes);
  app.get("/allEvents", api.allEvents);
  app.get("/clear", api.clearDB);
  return app;
};
