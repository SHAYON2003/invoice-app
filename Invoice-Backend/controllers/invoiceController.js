const Invoice = require('../models/Invoice')
const generateInvoicePDF = require('../utils/generateInvoicePDF')
const path = require('path')

exports.createInvoice = async(req,res) =>{
      try{
         const invoice = await Invoice.create(req.body)
         res.status(201).json(invoice)
      } catch(err){
        res.status(500).json({error: err.message})
      }
}

exports.getAllInvoices = async(req,res) =>{
      try{
         const invoices = await Invoice.find().populate('customer')
         res.json(invoices)
      } catch(err){
          res.status(500).json({error:err.message})
      }
}


exports.getInvoiceById = async(req,res) =>{
      try{
         const invoice = await Invoice.findById(req.params.id)
         if(!invoice) return res.status(404).json({error:"Invoice not found"})
         res.json(invoice)
      }catch(err){
       res.status(500).json({error:err.message})
      }
} 

exports.updateInvoice = async(req,res) =>{
        try{
             const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {new : true})
             res.json(invoice)
        } catch(err){
                  res.status(500).json({error: err.message})

        }
}


exports.deleteInvoice = async(req,res) =>{
        try{
            await Invoice.findByIdAndDelete(req.params.id)
            res.json({message: "Invoice deleted successfully"})
        }catch(err){
            res.status(500).json({error: err.message})
        }
}

exports.downloadInvoicePDF = async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.params.id);
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  
      const pdfPath = await generateInvoicePDF(invoice);
      res.download(pdfPath); // Sends the file to client
    } catch (err) {
      console.error('PDF error:', err);
      res.status(500).json({ error: 'Failed to generate invoice PDF' });
    }
  };

  exports.getAnalytics = async (req, res) => {
    try {
      const totalInvoices = await Invoice.countDocuments();
      const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
      const unpaidInvoices = await Invoice.countDocuments({ status: { $ne: 'paid' } });
  
      const totalRevenue = await Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
  
      res.status(200).json({
        totalInvoices,
        paidInvoices,
        unpaidInvoices,
        totalRevenue: totalRevenue[0]?.total || 0,
      });
    } catch (err) {
      console.error('Analytics error:', err);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  };
  