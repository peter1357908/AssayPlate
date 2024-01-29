const router = require("express").Router();
const PC = require("../Controllers/PlatesController");
const { auth } = require("../Middlewares/Auth");

router.get("/plates", auth, PC.ReadPlates);
router.post("/plates/specific", auth, PC.ReadPlatesSpecific);
router.post("/plates", auth, PC.CreatePlates);
router.put("/plates", auth, PC.UpdatePlates);
router.delete("/plates", auth, PC.DeletePlates);

module.exports = router;