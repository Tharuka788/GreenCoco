const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    unique: true,
  },
  wasteType: {
    type: String,
    required: true,
    enum: ['CoconutHusk', 'CoconutShell', 'CoconutFiber', 'CoconutPith', 'CoconutLeaves', 'CoconutTrunk'],
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Delivered', 'Cancelled'],
  },
}, { timestamps: true });

// Pre-save middleware to auto-increment orderNumber
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { 'orderNumber': -1 } });
    this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);