import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaHourglassHalf, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const InvoiceCompletionMeter = () => {
  const [complete, setComplete] = useState(0);
  const [drafts, setDrafts] = useState(0); // assuming you track drafts
  const [overdue, setOverdue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await axios.get('/api/invoices'); // Adjust path as needed
        const now = new Date();
        let completed = 0, draft = 0, over = 0;

        data.forEach(inv => {
          if (inv.status === 'paid') completed++;
          else if (new Date(inv.dueDate) < now) over++;
          else draft++;
        });

        setComplete(completed);
        setDrafts(draft);
        setOverdue(over);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching invoices", err);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <p className="text-gray-500">Loading meter...</p>;

  return (
    <div className="w-full max-w-md p-5 bg-white shadow-xl dark:bg-gray-900 rounded-2xl">
      <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Invoice Completion Meter</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-lg text-green-500" />
          <span className="text-gray-800 dark:text-gray-200">✅ Complete:</span>
          <span className="ml-auto font-bold text-green-600">{complete}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaHourglassHalf className="text-lg text-yellow-500" />
          <span className="text-gray-800 dark:text-gray-200">🕒 Drafts:</span>
          <span className="ml-auto font-bold text-yellow-600">{drafts}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaExclamationTriangle className="text-lg text-red-500" />
          <span className="text-gray-800 dark:text-gray-200">❌ Overdue:</span>
          <span className="ml-auto font-bold text-red-600">{overdue}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCompletionMeter;
