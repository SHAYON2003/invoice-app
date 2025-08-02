import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const CreateCustomer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/customers/create', formData);
      toast.success('Customer created 🚀');
      navigate('/customers');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create customer ❌');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 py-10 bg-gradient-to-tr from-[#e0f2fe] via-[#fef9c3] to-[#f0fdf4] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all"
    >
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl p-8 bg-white border border-gray-200 shadow-lg bg-opacity-80 rounded-2xl backdrop-blur-md dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 drop-shadow">
            ➕ Add New Customer
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Customer Name"
              className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full px-6 py-3 text-white transition-all rounded-md shadow bg-gradient-to-r from-green-500 to-lime-500 hover:scale-105 hover:shadow-xl"
            >
              🚀 Create Customer
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateCustomer;

