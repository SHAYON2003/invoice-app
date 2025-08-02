const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  const { amount, invoiceId } = req.body;

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `inv_rcptid_${invoiceId}`,
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({ orderId: response.id });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
