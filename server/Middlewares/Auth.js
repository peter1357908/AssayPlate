const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ unauthorized: true });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ unauthorized: true });
    } else {
      const user = await User.findById(data.id);
      if (!user) {
        console.log(`received valid token that contains a non-existing user _id. How?\n\nTOKEN:\n${token}\n\n_id:\n${data.id}`);
        return res.json({ unauthorized: true });
      }
      req.user = user;
      return next();
    }
  })
}