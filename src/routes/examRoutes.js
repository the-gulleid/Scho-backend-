const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const examController = require('../controllers/examController');

const router = express.Router();

router.get('/', protect, examController.getExams);
router.post('/', protect, authorize('teacher', 'admin'), examController.createExam);
router.put('/:id', protect, authorize('teacher', 'admin'), examController.updateExam);
router.delete('/:id', protect, authorize('admin'), examController.deleteExam);

module.exports = router;
