const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

async function generateInvoicePDF(invoiceData) {
     const browser = await puppeteer.launch()
     const page = await browser.newPage()


     const html=`
     <html>
       <head>
         <style>
           body { font-family: Arial, sans-serif; padding: 2rem; }
           h1 { color: #444; }
           .invoice-box { border: 1px solid #eee; padding: 20px; }
         </style>
       </head>
       <body>
         <h1>Invoice #${invoiceData._id}</h1>
         <div class="invoice-box">
           <p><strong>Client:</strong> ${invoiceData.clientEmail}</p>
           <p><strong>Amount:</strong> ${invoiceData.amount} ${invoiceData.currency}</p>
           <p><strong>Status:</strong> ${invoiceData.status}</p>
         </div>
       </body>
     </html>
   `
   await page.setContent(html,{waitUntil:'networkidle0'})

   const filePath = path.join(__dirname, `../pdfs/invoice-${invoiceData._id}.pdf`);
   await page.pdf({path: filePath , format:'A4' })
   await browser.close()
   return filePath
}

module.exports = generateInvoicePDF