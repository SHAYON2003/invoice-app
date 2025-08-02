import './App.css';
import { Routes, Route } from 'react-router-dom';
import InvoicesPage from './pages/InvoicesPage';
import CreateInvoice from './pages/CreateInvoice';
import EditInvoice from './pages/EditInvoice';
// import InvoiceDashboard from './pages/DashboardPage';
import CustomersPage from './pages/CustomerPage';

// import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import InvoiceDashboard from './pages/InvoiceDashboard';
import CreateCustomer from './pages/CreateCustomer';
import EditCustomer from './pages/EditCustomer';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="min-h-screen text-black transition-colors duration-300 bg-white dark:bg-gray-900 dark:text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<InvoicesPage />} />
        <Route path="/create-invoice" element={<CreateInvoice />} />
        <Route path="/edit-invoice/:id" element={<EditInvoice />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path='create-customer' element={<CreateCustomer/>} />
        <Route path='/edit-customer/:id' element={<EditCustomer/>} />
        
        
      </Routes>
    
    </div>
  );
}

export default App;
