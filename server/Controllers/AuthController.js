const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({message:'All fields are required'})
    }
    if (!username.match(/^[0-9a-z]+$/)) {
      return res.json({message:'Username can only contain alphanumerical characters'})
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({message:`User "${username}" already exists`});
    }
    try {
      const user = await User.create({ username, password });
    } catch (err) {
      return res.json({message:err.error.message})
    }
    
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: `User "${username}" signed up successfully. Logged in automatically.`, success: true });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({message:'Incorrect password or username' }) 
    }
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or username' }) 
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: `User "${username}" logged in successfully`, success: true });
    next();
  } catch (error) {
    console.error(error);
  }
}
