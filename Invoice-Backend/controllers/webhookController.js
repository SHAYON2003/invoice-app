
const Invoice = require('../models/Invoice');

exports.handlePaymentWebhook = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'No request body received' });
  }

  const { invoiceId, status } = req.body;

  if (!invoiceId || !status) {
    return res.status(400).json({ error: 'Missing invoiceId or status in request body' });
  }

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    invoice.status = status; // e.g., "Paid", "Failed", "Refunded"
    await invoice.save();

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ error: 'Server error while processing payment webhook' });
  }
};

