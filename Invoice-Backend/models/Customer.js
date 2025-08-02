const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  companyName: String,
  taxId: String, // GST/VAT
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
