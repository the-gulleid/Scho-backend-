const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/conversations', protect, chatController.getConversations);
router.get('/:userId', protect, chatController.getMessages);
router.post('/', protect, upload.single('attachment'), chatController.sendMessage);

module.exports = router;
