const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/maeri";

const mongoOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
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
