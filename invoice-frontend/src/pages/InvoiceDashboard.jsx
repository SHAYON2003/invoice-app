// src/components/InvoiceDashboard.jsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../api/axiosInstance';
import { motion } from 'framer-motion';

const COLORS = ['#22c55e', '#facc15', '#f97316']; // Tailwind greens/yellows/oranges

const InvoiceDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/invoices')
      .then(res => {
        const invoices = res.data;
        const statusCount = {
          Paid: 0,
          Unpaid: 0,
          Overdue: 0
        };

        invoices.forEach(inv => {
          statusCount[inv.status] = (statusCount[inv.status] || 0) + 1;
        });

        const chartData = Object.entries(statusCount).map(([key, value]) => ({
          name: key,
          value
        }));

        setData(chartData);
      })
      .catch(err => {
        console.error('Failed to fetch invoices:', err);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl p-6 mx-auto mt-10 shadow-xl bg-gradient-to-br from-white to-gray-100 rounded-2xl"
    >
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        🧾 Invoice Status Breakdown
      </h2>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default InvoiceDashboard;
