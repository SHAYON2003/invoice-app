import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchClient, setSearchClient] = useState('');
  const invoiceRefs = useRef({});

  useEffect(() => {
    axios
      .get('/invoices')
      .then((res) => {
        setInvoices(res.data);
        setFilteredInvoices(res.data);
      })
      .catch((err) => {
        console.error('Error fetching invoices:', err);
        toast.error('Failed to fetch invoices 😵');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [filterStatus, searchClient, invoices]);

  const filterInvoices = () => {
    let filtered = [...invoices];

    if (filterStatus !== 'All') {
      filtered = filtered.filter((inv) => inv.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (searchClient.trim() !== '') {
      filtered = filtered.filter((inv) =>
        inv.customer?.name?.toLowerCase().includes(searchClient.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await axios.delete(`/invoices/${id}`);
      const updated = invoices.filter((inv) => inv._id !== id);
      setInvoices(updated);
      toast.success('Invoice deleted successfully 🧾🔥');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete invoice 😢');
    }
  };

  const downloadPDF = async (id) => {
    const element = invoiceRefs.current[id];
    if (!element) return toast.error('Could not find invoice to download');

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${id}.pdf`);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  return (
    <div className="min-h-screen px-4 py-10 transition-all duration-300 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-white">Invoices</h1>
          <Link
            to="/create-invoice"
            className="px-6 py-2 text-white transition-all rounded-lg shadow bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:scale-105"
          >
            + Create Invoice
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-6 mb-8">
          <div className="flex flex-col">
            <label htmlFor="search" className="mb-1 text-sm font-medium text-black dark:text-white">
              Search Customer
            </label>
            <input
              id="search"
              type="text"
              placeholder="Type client name..."
              className="w-64 px-4 py-2 text-sm transition bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 text-sm font-medium text-black dark:text-white">
              Status
            </label>
            <select
              id="status"
              className="w-48 px-4 py-2 text-sm transition bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading invoices... ⏳</p>
        ) : filteredInvoices.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No invoices match your filters 🫠</p>
        ) : (
          <AnimatePresence>
            <ul className="space-y-8">
              {filteredInvoices.map((inv) => (
                <motion.li
                  key={inv._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative p-6 transition-all bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  <div
                    ref={(el) => (invoiceRefs.current[inv._id] = el)}
                    className="w-full max-w-3xl p-6 mx-auto text-white border border-gray-700 shadow-lg rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xl font-semibold">
                        <img src="/logo192.png" alt="Logo" className="w-6 h-6" />
                        Invoice <span className="text-yellow-400">#{inv.invoiceNumber}</span>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                        inv.status === 'paid'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm sm:text-base">
                      <p>
                        <span className="font-medium text-gray-400">👤 Customer:</span>{' '}
                        <span className="font-semibold text-white">{inv.customer?.name || inv.clientName}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-400">📧 Email:</span>{' '}
                        <a href={`mailto:${inv.customer?.email}`} className="text-blue-300 underline hover:text-blue-400">
                          {inv.customer?.email || 'N/A'}
                        </a>
                      </p>
                      <p>
                        <span className="font-medium text-gray-400">📅 Due Date:</span>{' '}
                        {inv.dueDate ? new Date(inv.dueDate).toDateString() : 'N/A'}
                      </p>
                      <p>
                        <span className="font-medium text-gray-400">💰 Amount:</span>{' '}
                        <span className="font-bold text-emerald-400">{formatCurrency(inv.totalAmount)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link
                      to={`/edit-invoice/${inv._id}`}
                      className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => downloadPDF(inv._id)}
                      className="px-4 py-2 text-sm font-medium text-white transition bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Download PDF
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
