const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const schoolController = require('../controllers/schoolController');

const router = express.Router();

router.get('/', protect, schoolController.getSchool);
router.put('/', protect, authorize('admin'), schoolController.updateSchool);
router.get('/stats', protect, authorize('admin'), schoolController.getDashboardStats);

module.exports = router;
