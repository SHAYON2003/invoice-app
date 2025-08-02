import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/customers')
      .then((res) => {
        setCustomers(res.data);
        setFilteredCustomers(res.data);
      })
      .catch(() => toast.error('Failed to fetch customers 😵'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = customers.filter((cust) =>
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer? 💀')) return;
    try {
      await axios.delete(`/customers/remove/${id}`);
      const updated = customers.filter(c => c._id !== id);
      setCustomers(updated);
      setFilteredCustomers(updated);
      toast.success('Customer deleted ✅');
    } catch {
      toast.error('Error deleting customer ❌');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 py-8 bg-gradient-to-tr from-[#dbeafe] via-[#f0fdf4] to-[#fefce8] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 drop-shadow-lg">
            👥 Customers
          </h1>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Link
              to="/create-customer"
              className="px-4 py-2 text-white transition-all rounded-md shadow-md bg-gradient-to-r from-green-500 to-lime-500 hover:scale-105 hover:shadow-lg"
            >
              + Add Customer
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading... ⏳</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">No customers found 🫥</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((cust, index) => (
              <motion.div
                key={cust._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.03 }}
                className="p-5 transition-all bg-white border border-gray-200 shadow-lg rounded-xl backdrop-blur-md bg-opacity-70 dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cust.name}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Email:</strong> {cust.email}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Phone:</strong> {cust.phone}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Link
                    to={`/edit-customer/${cust._id}`}
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cust._id)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomersPage;
