const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const studentController = require('../controllers/studentController');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.get('/profile/me', protect, authorize('student'), profileController.getStudentProfile);
router.get('/', protect, authorize('admin', 'teacher'), studentController.getStudents);
router.get('/:id', protect, studentController.getStudent);
router.post('/', protect, authorize('admin'), studentController.createStudent);
router.put('/:id', protect, authorize('admin'), studentController.updateStudent);
router.delete('/:id', protect, authorize('admin'), studentController.deleteStudent);

module.exports = router;
