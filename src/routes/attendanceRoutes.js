const router = require("express").Router();
const { punchIn, punchOut, getAttendance } = require("../controllers/attendanceController");

router.post("/punch-in", punchIn);
router.post("/punch-out", punchOut);
router.get("/:employeeId", getAttendance);

module.exports = router;
