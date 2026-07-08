const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const classController = require('../controllers/classController');

const router = express.Router();

router.get('/', protect, classController.getClasses);
router.get('/:id', protect, classController.getClass);
router.post('/', protect, authorize('admin'), classController.createClass);
router.put('/:id', protect, authorize('admin'), classController.updateClass);
router.put('/:id/timetable', protect, authorize('admin', 'teacher'), classController.updateTimetable);
router.delete('/:id', protect, authorize('admin'), classController.deleteClass);

module.exports = router;
