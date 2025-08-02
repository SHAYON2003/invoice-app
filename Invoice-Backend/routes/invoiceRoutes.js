const express = require('express');
const router = express.Router();
const { 
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  downloadInvoicePDF,
  getAnalytics
} = require('../controllers/invoiceController');

router.post('/', createInvoice);
router.get('/', getAllInvoices);
router.get('/analytics', getAnalytics); // 👈 move this up
router.get('/:id/download', downloadInvoicePDF);
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;
