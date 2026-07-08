const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const parentController = require('../controllers/parentController');

const router = express.Router();

router.get('/profile/me', protect, authorize('parent'), parentController.getParentByUser);
router.get('/', protect, authorize('admin'), parentController.getParents);
router.get('/:id', protect, parentController.getParent);
router.post('/', protect, authorize('admin'), parentController.createParent);
router.put('/:id', protect, authorize('admin'), parentController.updateParent);
router.delete('/:id', protect, authorize('admin'), parentController.deleteParent);

module.exports = router;
