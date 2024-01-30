const router = require("express").Router();
const PC = require("../Controllers/PlatesController");
const { auth } = require("../Middlewares/Auth");

router.get("/plates", auth, PC.GetPlatesAndUsername);
router.post("/plates/create", auth, PC.CreatePlates);
router.post("/plates/read", auth, PC.ReadPlates);
router.post("/plates/update", auth, PC.UpdatePlates);
router.post("/plates/delete", auth, PC.DeletePlates);

module.exports = router;