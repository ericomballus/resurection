const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/customerDb";

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = () => mongoose.createConnection(url, mongoOptions);

const connectToMongoDB = () => {
  const db = connect();
  db.on("open", () => {
    console.log(`Mongoose connection open to ${JSON.stringify(url)}`);
  });
  db.on("error", (err) => {
    console.log(
      `Mongoose connection error: ${err} with connection info ${JSON.stringify(
        url
      )}`
    );
    process.exit(0);
  });
  return db;
};

//let myDb = connectToMongoDB().useDb("dbName", { useCache: true });

exports.mongodb = connectToMongoDB();
