const Categories = require('./model');

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new Categories(payload);
    await category.save();
    return res.json(category);
  } catch (err) {
    if (err && err.name == 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = await Categories.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(category);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
  }
};

const destroy = async (req, res, next) => {
  try {
    let category = await Categories.findByIdAndDelete(req.params.id);
    return res.json(category);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    let category = await Categories.find();
    return res.json(category);
  } catch (err) {
    if (err && err.name == 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const count = async (req, res, next) => {
  try {
    // count all categories
    let count = await Categories.countDocuments();
    return res.json(count);
  } catch (err) {
    if (err && err.name == 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = {
  store,
  update,
  destroy,
  index,
  count,
};
