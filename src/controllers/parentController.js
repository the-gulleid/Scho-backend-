const { Parent, User, Student } = require('../models');
const ApiError = require('../utils/ApiError');

exports.getParents = async (req, res, next) => {
  try {
    const parents = await Parent.find({ isActive: true })
      .populate('user', 'firstName lastName email phone')
      .populate({ path: 'children', populate: { path: 'user', select: 'firstName lastName' } })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: parents });
  } catch (error) {
    next(error);
  }
};

exports.getParent = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id)
      .populate('user', '-password')
      .populate({ path: 'children', populate: [{ path: 'user' }, { path: 'class' }] });

    if (!parent) throw new ApiError(404, 'Parent not found');
    res.json({ success: true, data: parent });
  } catch (error) {
    next(error);
  }
};

exports.getParentByUser = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ user: req.user._id })
      .populate('user', '-password')
      .populate({ path: 'children', populate: [{ path: 'user' }, { path: 'class' }] });

    if (!parent) throw new ApiError(404, 'Parent profile not found');
    res.json({ success: true, data: parent });
  } catch (error) {
    next(error);
  }
};

exports.createParent = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, children, ...parentData } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: password || 'Parent@123',
      phone,
      role: 'parent',
    });

    const parent = await Parent.create({
      user: user._id,
      children: children || [],
      ...parentData,
    });

    if (children?.length) {
      await Student.updateMany({ _id: { $in: children } }, { parent: parent._id });
    }

    const populated = await Parent.findById(parent._id)
      .populate('user', 'firstName lastName email')
      .populate('children');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateParent = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) throw new ApiError(404, 'Parent not found');

    const { firstName, lastName, phone, ...parentData } = req.body;
    if (firstName || lastName || phone) {
      await User.findByIdAndUpdate(parent.user, { firstName, lastName, phone });
    }

    const updated = await Parent.findByIdAndUpdate(req.params.id, parentData, { new: true })
      .populate('user', 'firstName lastName email phone')
      .populate('children');

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteParent = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) throw new ApiError(404, 'Parent not found');

    await Parent.findByIdAndUpdate(req.params.id, { isActive: false });
    await User.findByIdAndUpdate(parent.user, { isActive: false });

    res.json({ success: true, message: 'Parent deactivated' });
  } catch (error) {
    next(error);
  }
};
