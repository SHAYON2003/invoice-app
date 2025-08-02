import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    invoiceNumber: '',
    clientName: '',
    totalAmount: '',
    status: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/invoices/${id}`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        toast.error('Failed to load invoice data');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/invoices/${id}`, form);
      toast.success('Invoice updated successfully!');
      navigate('/');
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update invoice');
    }
  };

  if (loading) return <p className="p-4 text-center text-gray-500">Loading invoice data...</p>;

  return (
    <form
      onSubmit={handleUpdate}
      className="max-w-2xl p-8 mx-auto mt-10 shadow-lg rounded-xl bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <h2 className="mb-6 text-3xl font-bold text-center text-blue-600 dark:text-yellow-300">
        ✏️ Edit Invoice
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Invoice Number
          </label>
          <input
            name="invoiceNumber"
            value={form.invoiceNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="e.g. #INV-00123"
            required
          />
        </div>

        <div>
          {/* <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Client Name
          </label> */}
          {/* <input
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="e.g. John Doe"
            required
          /> */}
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Total Amount
          </label>
          <input
            type="number"
            name="totalAmount"
            value={form.totalAmount}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="e.g. 999"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            required
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          type="submit"
          className="px-8 py-3 text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-yellow-400 dark:to-yellow-500 dark:hover:from-yellow-500 dark:hover:to-yellow-600"
        >
          💾 Update Invoice
        </button>
      </div>
    </form>
  );
};

export default EditInvoice;
