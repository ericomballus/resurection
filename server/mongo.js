const mongoose = require("mongoose");
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/maeri";

mongoose.Promise = global.Promise;
mongoose.connect(url);
module.exports = mongoose;
