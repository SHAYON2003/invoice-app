import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    dueDate: '',
  });

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/customers');
        setCustomers(res.data);
     
      } catch (err) {
        console.error('Error fetching customers:', err);
        toast.error('Failed to load customers');
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...invoiceData.items];
    updatedItems[index][name] = name === 'description' ? value : Number(value);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, price: 0 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = invoiceData.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    try {
      await axios.post('/invoices', {
        invoiceNumber: invoiceData.invoiceNumber,
        customer: selectedCustomer,
        items: invoiceData.items,
        totalAmount,
        dueDate: invoiceData.dueDate,
        
      });
      navigate('/')
      // toast.success('Invoice created successfully! 🎉');

      setInvoiceData({
        invoiceNumber: '',
        items: [{ description: '', quantity: 1, price: 0 }],
        dueDate: '',
      });
      setSelectedCustomer('');

      setTimeout(() => {
        navigate('/'); // 🧭 Redirect to invoices page
      }, 0);

    } catch (err) {
      console.error('Error creating invoice:', err?.response?.data || err.message);
      toast.error('Failed to create invoice');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl p-8 mx-auto mt-10 space-y-6 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl"
    >
      <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">Create Invoice</h2>

      <input
        type="text"
        name="invoiceNumber"
        placeholder="Invoice Number"
        value={invoiceData.invoiceNumber}
        onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
        required
      />

      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
        required
      >
        <option value="">Select Customer</option>
        {customers.map((cust) => (
          <option key={cust._id} value={cust._id}>
            {cust.name} ({cust.email})
          </option>
        ))}
      </select>

      <div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">Invoice Items</h3>
        {invoiceData.items.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 gap-4 p-4 mb-4 bg-white border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 sm:grid-cols-3"
          >
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleChange(idx, e)}
              className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleChange(idx, e)}
              className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              min="1"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleChange(idx, e)}
              className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              min="0"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          + Add Item
        </button>
      </div>

      <input
        type="date"
        name="dueDate"
        value={invoiceData.dueDate}
        onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
        required
      />

      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Total: ₹{invoiceData.items.reduce((acc, item) => acc + item.quantity * item.price, 0)}
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 text-lg font-semibold text-white transition-all bg-green-600 rounded-md hover:bg-green-700"
      >
        Save Invoice
      </button>
    </motion.form>
  );
};

export default CreateInvoice;
