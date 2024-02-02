const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose);
db.userGtms = require("./userGTM.model.js")(mongoose);
db.userAudience = require("./userAudience.model.js")(mongoose);
db.getMessage = require("./inputMsg.model.js")(mongoose);

module.exports = db;
