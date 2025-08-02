import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/customers/${id}`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch customer:', err);
        toast.error('Error loading customer');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/customers/${id}`, form);
      toast.success('Customer updated successfully');
      navigate('/customers');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update customer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-lg text-gray-600 dark:text-gray-300">
        Loading customer info...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl p-8 mx-auto space-y-6 bg-white border border-gray-200 shadow-xl dark:bg-gray-900 rounded-2xl dark:border-gray-700"
      >
        <h2 className="mb-4 text-3xl font-extrabold text-center text-purple-700 dark:text-purple-300">
          ✨ Edit Customer Details
        </h2>

        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full p-3 transition bg-white border rounded-lg outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full p-3 transition bg-white border rounded-lg outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="w-full p-3 transition bg-white border rounded-lg outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, City, State"
            className="w-full p-3 transition bg-white border rounded-lg outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            className="inline-block px-8 py-3 font-semibold text-white transition rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-lg hover:from-purple-600 hover:to-indigo-700"
          >
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;
