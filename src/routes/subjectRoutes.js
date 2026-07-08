const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

router.get('/', protect, subjectController.getSubjects);
router.get('/:id', protect, subjectController.getSubject);
router.post('/', protect, authorize('admin'), subjectController.createSubject);
router.put('/:id', protect, authorize('admin'), subjectController.updateSubject);
router.delete('/:id', protect, authorize('admin'), subjectController.deleteSubject);

module.exports = router;
