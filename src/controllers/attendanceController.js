const Attendance = require("../models/attendance");
const Employee = require("../models/employee");

// Punch-in
exports.punchIn = async (req, res) => {
    try {
        const { employeeId } = req.body;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const attendance = await Attendance.findOne({
            employeeId,
            date: { $gte: todayStart, $lte: todayEnd }
        });

        if (attendance) {
            return res.status(400).json({ message: "Already punched in today" });
        }

        const newAttendance = await Attendance.create({
            employeeId,
            punchIn: new Date(),    
            date: new Date()   // Store the date
        });

        res.json(newAttendance);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Punch-out
exports.punchOut = async (req, res) => {
    try {
        const { employeeId } = req.body;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const attendance = await Attendance.findOne({
            employeeId,
            date: { $gte: todayStart, $lte: todayEnd }
        });

        if (!attendance) {
            return res.status(400).json({ message: "Punch-in first" });
        }

        attendance.punchOut = new Date();
        await attendance.save();

        res.json(attendance);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get attendance by employee
exports.getAttendance = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const records = await Attendance.find({
            employeeId: req.params.employeeId
        });

        res.json(records);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};