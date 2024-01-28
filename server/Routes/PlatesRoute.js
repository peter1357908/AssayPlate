const router = require("express").Router();
const { ReadPlates, CreatePlates, UpdatePlates, DeletePlates } = require("../Controllers/PlatesController");
const { auth } = require("../Middlewares/Auth");

router.get("/plates", auth, ReadPlates);
router.post("/plates", auth, CreatePlates);
router.put("/plates", auth, UpdatePlates);
router.delete("/plates", auth, DeletePlates);

module.exports = router;