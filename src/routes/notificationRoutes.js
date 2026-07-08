const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.get('/', protect, notificationController.getNotifications);
router.post('/', protect, authorize('admin', 'teacher'), notificationController.createNotification);
router.put('/:id/read', protect, notificationController.markAsRead);
router.delete('/:id', protect, authorize('admin'), notificationController.deleteNotification);

module.exports = router;
