const { Notification, User } = require('../models');
const ApiError = require('../utils/ApiError');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipients: req.user._id },
        { targetRoles: req.user.role },
        { sender: req.user._id },
      ],
    })
      .populate('sender', 'firstName lastName role')
      .sort({ createdAt: -1 })
      .limit(50);

    const withReadStatus = notifications.map((n) => ({
      ...n.toObject(),
      isReadByUser: n.isRead.some((r) => r.user.toString() === req.user._id.toString()),
    }));

    res.json({ success: true, data: withReadStatus });
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      sender: req.user._id,
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) throw new ApiError(404, 'Notification not found');

    const alreadyRead = notification.isRead.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      notification.isRead.push({ user: req.user._id, readAt: new Date() });
      await notification.save();
    }

    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};
