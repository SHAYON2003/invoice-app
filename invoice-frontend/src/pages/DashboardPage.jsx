import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import InvoiceCompletionMeter from "../components/InvoiceCompletionMeter"; // 🧠 Add this line

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/invoices");
        setInvoices(response.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchInvoices();
  }, []);

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((invoice) => invoice.status?.toLowerCase() === "paid");
  const unpaidInvoices = invoices.filter((invoice) => invoice.status?.toLowerCase() === "unpaid");

  const revenue = paidInvoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
  const paidCount = paidInvoices.length;
  const unpaidCount = unpaidInvoices.length;

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="mb-6 text-3xl font-bold text-center">📊 Dashboard Analytics</h1>

      {/* 🚀 Grid with 2 columns: stats on left, meter on right */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Stat Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <StatCard title="Total Invoices" value={totalInvoices} color="from-purple-500 to-pink-500" />
          <StatCard title="Revenue" value={`₹${revenue.toLocaleString()}`} color="from-green-500 to-emerald-600" />
          <StatCard title="Paid" value={paidCount} color="from-blue-500 to-indigo-500" />
          <StatCard title="Unpaid" value={unpaidCount} color="from-yellow-400 to-yellow-600" />
        </div>

        {/* Right: Completion Meter */}
        <InvoiceCompletionMeter />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`p-6 rounded-xl shadow-md text-white bg-gradient-to-br ${color} text-center dark:shadow-lg`}
  >
    <h2 className="font-medium text-md">{title}</h2>
    <p className="mt-1 text-2xl font-bold">{value}</p>
  </motion.div>
);

export default Dashboard;
