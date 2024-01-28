const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({message:"Unauthorized."});
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.status(401).json({message:"Unauthorized."});
    } else {
      const user = await User.findById(data.id);
      if (!user) {
        return res.status(401).json({message:"User in token doesn't exist."});
      }
      req.user = user;
      return next();
    }
  })
}