const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const assignmentController = require('../controllers/assignmentController');

const router = express.Router();

router.get('/', protect, assignmentController.getAssignments);
router.get('/:id', protect, assignmentController.getAssignment);
router.post('/', protect, authorize('teacher'), upload.array('attachments', 5), assignmentController.createAssignment);
router.post('/:id/submit', protect, authorize('student'), upload.single('file'), assignmentController.submitAssignment);
router.put('/:id/grade', protect, authorize('teacher'), assignmentController.gradeSubmission);
router.delete('/:id', protect, authorize('teacher', 'admin'), assignmentController.deleteAssignment);

module.exports = router;
