const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

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
  res.cookie("token", token, {
    withCredentials: true,
    httpOnly: false,
  });
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
  res.cookie("token", token, {
    withCredentials: true,
    httpOnly: false,
  });
  return res.json({
    message: `"${username}" logged in successfully`,
    success: true
  });
}
