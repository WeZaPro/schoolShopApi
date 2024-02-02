module.exports = (app) => {
  // const tutorials = require("../controllers/tutorial.controller.js");
  const lineBot = require("../controllers/lineChatBot.controller");

  var router = require("express").Router();

  // Create a new Tutorial
  router.get("/webhook", lineBot.getChat);

  router.post("/webhook", lineBot.chat);

  app.use("/api/", router);
};
