require("dotenv").config();
const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

const loginCookieOptions = process.env.NODE_ENV ? {
  withCredentials: true,
  httpOnly: false,
  sameSite: "none",
  secure: true,
  partitioned: true,
} : {
  withCredentials: true,
  httpOnly: false,
};

const logoutCookieOptions = {
  ...loginCookieOptions,
  expires: new Date(0)
};

module.exports.Signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({message:"All fields are required."});
  }
  if (typeof username != "string" || typeof password != "string") {
    return res.json({message:"Username and password must both be strings."});
  }
  if (!username.match(/^[0-9a-z]+$/)) {
    return res.json({message:"Username can only contain English letters and numbers."});
  }
  if (username.length > 20) {
    return res.json({message:"Username can have at most 20 characters."});
  }
  if (password.length > 20) {
    return res.json({message:"password can have at most 20 characters."});
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.json({message:`User "${username}" already exists`});
  }
  let user;
  try {
    user = await User.create({ username, password: await bcrypt.hash(password, 12) });
  } catch (err) {
    return res.json({message:err.toString()});
  }
  
  const token = createSecretToken(user._id);
  res.cookie("token", token, loginCookieOptions);
  
  return res.json({ 
    message: `"${username}" signed up successfully. Logged in automatically.`,
    success: true
  });
};

module.exports.Login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({message:"All fields are required"});
  }
  if (typeof username != "string" || typeof password != "string") {
    return res.json({message:"Username and password must both be strings."});
  }
  if (!username.match(/^[0-9a-z]+$/) || username.length > 20 || password.length > 20) {
    return res.json({message:"Incorrect password or username" });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({message:"Incorrect password or username" });
  }
  const auth = await bcrypt.compare(password, user.password)
  if (!auth) {
    return res.json({message:"Incorrect password or username" }); 
  }
  const token = createSecretToken(user._id);
  res.cookie("token", token, loginCookieOptions);
  return res.json({
    message: `"${username}" logged in successfully`,
    success: true
  });
}

module.exports.Logout = async (req, res) => {
  // since the token isn't actually stateful, we simply send
  // back a response to mark the cookie as expired AND invalid
  res.cookie("token", "INVALID", logoutCookieOptions);
  return res.end();
}

module.exports.GetUsername = async (req, res) => {
  return res.json({ username: req.user.username });
};

module.exports.DeleteUser = async (req, res) =>{
  await User.deleteOne({ _id: req.user._id });  // don't have to await
  res.cookie("token", "INVALID", logoutCookieOptions);
  return res.end();
}