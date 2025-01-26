const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Invoice = require('../invoice/model');
const options = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};
const orderItemSchema = Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
});

const orderSchema = Schema(
  {
    status: {
      type: String,
      enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
      default: 'waiting_payment',
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      provinsi: {
        type: String,
        required: [true, 'Provinsi harus diisi'],
      },
      kabupaten: {
        type: String,
        required: [true, 'Kabupaten harus diisi'],
      },
      kecamatan: {
        type: String,
        required: [true, 'Kecamatan harus diisi'],
      },
      kelurahan: {
        type: String,
        required: [true, 'Kelurahan harus diisi'],
      },
    },
    detail: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    order_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }], // Referensi ke OrderItem
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
  { timestamps: true },
);

// Auto-increment plugin
orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });

// Virtual field to calculate items count
orderSchema.virtual('items_count').get(function () {
  return this.order_items.reduce((total, item) => total + item.qty, 0);
});

// Post-save hook to create invoice
// orderSchema.post('save', async function () {
//   let sub_total = this.order_items.reduce(
//     (total, item) => total + item.price * item.qty,
//     0,
//   );

//   let invoice = new Invoice({
//     user: this.user,
//     order: this._id,
//     sub_total: sub_total,
//     delivery_fee: this.delivery_fee,
//     total: sub_total + this.delivery_fee,
//     delivery_address: this.delivery_address,
//   });

//   await invoice.save();
// });

module.exports = model('Order', orderSchema);
