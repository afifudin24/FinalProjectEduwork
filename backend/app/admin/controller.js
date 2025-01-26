const User = require('../user/model');
const Categories = require('../category/model');
const Product = require('../product/models');
const Order = require('../order/model');

const countAll = async (req, res, next) => {
  try {
    let countCategories = await Categories.countDocuments();
    let countUsers = await User.countDocuments();
    let countProduct = await Product.countDocuments();
    let countOrder = await Order.countDocuments();
    res.json({ countCategories, countUsers, countProduct, countOrder });
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

module.exports = { countAll };
