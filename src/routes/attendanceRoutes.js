const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.post('/mark', protect, authorize('teacher', 'admin'), attendanceController.markAttendance);
router.get('/class', protect, attendanceController.getAttendanceByClass);
router.get('/student/:studentId', protect, attendanceController.getStudentAttendance);

module.exports = router;
