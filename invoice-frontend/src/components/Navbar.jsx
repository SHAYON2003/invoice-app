import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const [hovered, setHovered] = useState(null);

  const navItems = [
    { path: '/', label: 'Invoices' },
    { path: '/create-invoice', label: 'Create' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/customers', label: "Customers" }
  ];

  const linkStyle = (path) =>
    location.pathname === path
      ? 'text-blue-600 dark:text-yellow-300 font-semibold border-b-2 border-blue-600 dark:border-yellow-300'
      : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors duration-300';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 flex items-center justify-between w-full px-10 py-4 border-b border-gray-200 shadow-md backdrop-blur-md bg-white/70 dark:bg-gray-900/80 dark:border-gray-700"
    >
      <motion.div
        className="text-3xl font-bold tracking-wide text-blue-600 dark:text-yellow-300"
        whileHover={{ scale: 1.05 }}
      >
        InvoiceX
      </motion.div>

      <div className="flex items-center gap-8 text-sm font-medium">
        {navItems.map((item, i) => (
          <motion.div
            key={item.path}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.1 }}
          >
            <Link className={linkStyle(item.path)} to={item.path}>
              {item.label}
            </Link>
            {hovered === i && (
              <motion.div
                layoutId="underline"
                className="h-[2px] w-full bg-blue-500 dark:bg-yellow-300 rounded"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        ))}

        <button
          onClick={toggleTheme}
          className="p-2 ml-2 text-xl transition-colors duration-300 bg-gray-200 rounded-full dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          title="Toggle Theme"
        >
          {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-blue-600" />}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
