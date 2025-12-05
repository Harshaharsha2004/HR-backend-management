const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const Employee = require("../models/employee");

exports.getPayroll = async (req, res) => {
    try {
        const employeeId = new mongoose.Types.ObjectId(req.params.employeeId);

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // 📌 Get current month dates
        const start = new Date();
        start.setDate(1);
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);

        // 📌 Fetch attendance for this employee in this month
        const attendance = await Attendance.find({
            employeeId,
            date: { $gte: start, $lte: end }
        });

        // 📌 Count days present
        const daysPresent = attendance.filter(
            a => a.punchIn || a.status === "Present"
        ).length;

        const totalDaysInMonth = 30;
        const salary = (employee.salary / totalDaysInMonth) * daysPresent;

        res.json({
            employee: employee.name,
            daysPresent,
            salary: salary.toFixed(2)
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
