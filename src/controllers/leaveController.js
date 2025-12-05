const mongoose = require("mongoose");
const Leave = require("../models/leave");
const Employee = require("../models/employee");

// Apply leave
exports.applyLeave = async (req, res) => {
    try {
        const leave = await Leave.create(req.body);
        res.status(201).json(leave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Approve leave
exports.approveLeave = async (req, res) => {
    try {
        const leaveId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(leaveId)) {
            return res.status(400).json({ message: "Invalid leave ID" });
        }

        const leave = await Leave.findById(leaveId).populate("employeeId", "name");
        if (!leave) return res.status(404).json({ message: "Leave not found" });

        leave.status = "Approved";
        await leave.save();

        res.status(200).json({
            _id: leave._id,
            employeeId: leave.employeeId._id,
            employeeName: leave.employeeId.name, 
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            reason: leave.reason,
            status: leave.status,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.rejectLeave = async (req, res) => {
    try {
        const leaveId = req.params.id;

        // Find leave by ID
        const leave = await Leave.findById(leaveId).populate("employeeId", "name");
        if (!leave) return res.status(404).json({ message: "Leave not found" });

        // Optional: Check if employee exists
        const employee = await Employee.findById(leave.employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        // Update status
        leave.status = "Rejected";
        await leave.save();

        res.status(200).json({
            _id: leave._id,
            employeeId: leave.employeeId._id,
            employeeName: leave.employeeId.name, 
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            reason: leave.reason,
            status: leave.status,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};