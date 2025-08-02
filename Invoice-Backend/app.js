const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()

// ✅ Apply CORS as early as possible
app.use(cors({
  origin: 'http://localhost:3001', // or use '*' for dev only
  credentials: true,
}));

// ✅ Parse JSON
app.use(express.json())

// ✅ Routes
const webhookRoutes = require('./routes/webhookRoutes')
app.use('/api/webhooks', webhookRoutes)

const customerRoutes = require('./routes/customerRoutes')
app.use('/api/customers', customerRoutes)

const invoiceRoutes = require('./routes/invoiceRoutes')
app.use('/api/invoices', invoiceRoutes)

app.get('/', (req, res) => {
  res.send('Invoice API is running...')
})

// ✅ Connect DB & start server
const PORT = process.env.PORT || 4000
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch((error) => console.error('❌ Database connection error:', error))

  import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);  // for ES module
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}
