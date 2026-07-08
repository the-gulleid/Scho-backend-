const { Message, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { getConversationId } = require('../utils/helpers');

exports.getConversations = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('sender receiver', 'firstName lastName role avatar');

    const conversationMap = new Map();
    for (const msg of messages) {
      if (!conversationMap.has(msg.conversationId)) {
        const otherUser =
          msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
        conversationMap.set(msg.conversationId, {
          conversationId: msg.conversationId,
          otherUser,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unread: msg.receiver._id.toString() === req.user._id.toString() && !msg.isRead,
        });
      }
    }

    res.json({ success: true, data: Array.from(conversationMap.values()) });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const conversationId = getConversationId(req.user._id, userId);

    const messages = await Message.find({ conversationId })
      .populate('sender receiver', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { conversationId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const receiver = await User.findById(receiverId);
    if (!receiver) throw new ApiError(404, 'Receiver not found');

    const attachment = req.file
      ? {
          filename: req.file.filename,
          url: `/uploads/${req.file.filename}`,
          mimetype: req.file.mimetype,
        }
      : undefined;

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      attachment,
      conversationId: getConversationId(req.user._id, receiverId),
    });

    const populated = await Message.findById(message._id)
      .populate('sender receiver', 'firstName lastName avatar');

    // Emit via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('new_message', populated);
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};
