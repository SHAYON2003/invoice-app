const Customer = require('../models/Customer')

exports.createCustomer = async (req, res) => {
    try {
      const customer = new Customer(req.body);
      await customer.save();
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  exports.getCustomers = async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
  };

  exports.getCustomerById = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  };


exports.updateCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  };

  exports.deleteCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  };