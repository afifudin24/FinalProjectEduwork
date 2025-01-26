const CartItem = require('../cart-item/model');
const DeliveryAddress = require('../deliveryAddress/model');
const Order = require('../order/model');
const { Types } = require('mongoose');
const Orderitem = require('../order-item/model');
const Invoice = require('../invoice/model');
const mongoose = require('mongoose');

const store = async (req, res, next) => {
  console.log(req.body);
  try {
    let { delivery_fee, delivery_address, totalAmount } = req.body;
    console.log('iniamount', totalAmount);
    function generateRandomId() {
      const prefix = 'INV';
      const timestamp = Date.now(); // Get the current timestamp
      return `${prefix}${timestamp}`; // Combine prefix with timestamp
    }
    const invId = new mongoose.Types.ObjectId();
    // Ambil item dari keranjang berdasarkan user
    let items = await CartItem.find({ user: req.user._id }).populate('product');
    if (!items.length) {
      return res.json({
        error: 1,
        message: `You can't create an order because your cart is empty.`,
      });
    }
    // Ambil alamat pengiriman
    let address = await DeliveryAddress.findById(delivery_address);
    // Buat order baru
    let order = new Order({
      _id: new Types.ObjectId(),
      status: 'waiting_payment',
      delivery_fee: parseInt(delivery_fee),
      invoice: invId,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: req.user._id,
    });
    // Masukkan item ke dalam order_items
    let orderItems = await Orderitem.insertMany(
      items.map((item) => ({
        name: item.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id,
      })),
    );
    orderItems.forEach((item) => order.order_items.push(item));
    await order.save();
    // Hapus semua item dari keranjang setelah pesanan dibuat
    await CartItem.deleteMany({ user: req.user._id });
    // Buat invoice baru
    let invoice = new Invoice({
      _id: invId,
      totals: parseInt(totalAmount),
      payment_status: 'waiting_payment',
      user: req.user._id,
      order: order._id,
    });
    await invoice.save();

    console.log(invoice);

    // Kirim response order dan invoice
    return res.json({ order, invoice });
  } catch (err) {
    console.log(err);
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
    const userId = req.user._id; // Ambil userId dari request (misalnya dari token yang sudah di-decode)

    // Query untuk mencari semua order berdasarkan userId
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'order_items', // Populate relasi order_items
        populate: { path: 'product' }, // Populate relasi product di dalam order_items
      })
      .sort('-createdAt') // Sortir berdasarkan waktu terbaru
      .exec();

    // Jika tidak ada order
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: 1,
        message: 'No orders found for this user.',
      });
    }

    return res.json({
      data: orders,
    });
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
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    // buatkan update nya
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ order });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
  }
  next(err);
};
const getOrderWithItems = async (req, res, next) => {
  try {
    const { orderId } = req.params; // Ambil ID Order dari parameter URL

    // Cari order berdasarkan ID dan populate order_items
    const order = await Order.findById(orderId)
      .populate({
        path: 'order_items', // Populate order_items
        populate: { path: 'product' }, // Populate product di dalam order_items
      })
      .exec();

    if (!order) {
      return res.status(404).json({
        error: 1,
        message: 'Order not found',
      });
    }

    return res.json({
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(500).json({
        message: 'You Are Not Allowed',
      });
    }

    // Query untuk mencari semua order berdasarkan userId
    const orders = await Order.find()
      .populate({
        path: 'order_items', // Populate relasi order_items
        populate: { path: 'product' }, // Populate relasi product di dalam order_items
      })
      .populate('invoice')
      .populate('user')
      .sort('-createdAt') // Sortir berdasarkan waktu terbaru
      .exec();

    // Jika tidak ada order
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: 1,
        message: 'No orders found for this user.',
      });
    }

    return res.json({
      data: orders,
    });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
  }
  next(err);
};

const report = async (req, res, next) => {
  try {
    // Ambil query parameter untuk tanggal
    const { start_date, end_date } = req.query;

    // Buat filter untuk query
    const filter = {
      status: 'delivered',
    };

    // Tambahkan filter untuk rentang tanggal jika ada
    if (start_date || end_date) {
      filter.createdAt = {};
      if (start_date) {
        filter.createdAt.$gte = new Date(start_date); // Tanggal mulai
      }
      if (end_date) {
        filter.createdAt.$lte = new Date(end_date); // Tanggal akhir
      }
    }

    // Query untuk mencari semua order berdasarkan filter
    const allorders = await Order.find(filter)
      .populate({
        path: 'order_items', // Populate relasi order_items
        populate: { path: 'product' }, // Populate relasi product di dalam order_items
      })
      .populate('invoice')
      .populate('user')
      .sort('-createdAt') // Sortir berdasarkan waktu terbaru
      .exec();
    const orders = allorders.filter(
      (odr) => odr.invoice.payment_status === 'paid',
    );
    // Jika tidak ada order
    if (!orders || orders.length === 0) {
      return res.json({
        data: 0,
        message: 'No orders found for this user.',
      });
    }

    return res.json({
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  store,
  index,
  getAllOrder,
  update,
  report,
};
