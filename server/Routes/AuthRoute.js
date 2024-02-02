const {
  Signup,
  Login,
  Logout,
  GetUsername,
  DeleteUser,
} = require("../Controllers/AuthController");
const { auth } = require("../Middlewares/Auth");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/", auth, GetUsername);
router.delete("/", auth, DeleteUser);

module.exports = router;