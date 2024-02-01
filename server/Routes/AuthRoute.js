const { Signup, Login, Logout, GetUsername } = require("../Controllers/AuthController");
const { auth } = require("../Middlewares/Auth");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/", auth, GetUsername);  // just for testing if the cookie is valid

module.exports = router;