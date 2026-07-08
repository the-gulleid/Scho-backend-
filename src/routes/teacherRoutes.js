const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const teacherController = require('../controllers/teacherController');

const router = express.Router();

router.get('/profile/me', protect, authorize('teacher'), teacherController.getTeacherByUser);
router.get('/', protect, authorize('admin'), teacherController.getTeachers);
router.get('/:id', protect, teacherController.getTeacher);
router.post('/', protect, authorize('admin'), teacherController.createTeacher);
router.put('/:id', protect, authorize('admin'), teacherController.updateTeacher);
router.delete('/:id', protect, authorize('admin'), teacherController.deleteTeacher);

module.exports = router;
