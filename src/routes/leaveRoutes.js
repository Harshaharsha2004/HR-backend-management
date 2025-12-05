const router = require("express").Router();
const { applyLeave, approveLeave ,rejectLeave} = require("../controllers/leaveController");

router.post("/", applyLeave);
router.put("/:id/approve", approveLeave);
router.put("/:id/reject", rejectLeave);

module.exports = router;
