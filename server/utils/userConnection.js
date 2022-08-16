const User = require("../api/models/user");
const userHandler = async (req, res, next) => {
  if (req.query.adminId) {
    //  console.log("hello admin Id", req.query.adminId);
  }

  if (req.query.db) {
    try {
      const user = await User.findById({ _id: req.query.db });
      // console.log(user);
      // console.log(`day of the month =====> ${new Date().getDate()}`);
      let userUpdate = await user.handleConnection(
        `${req.method} --> ${req.url}`
      );
      req.io.sockets.emit(`incomingRequest`, userUpdate);
    } catch (error) {
      console.log(error.message);
    }
  }

  next();
};

module.exports = userHandler;
