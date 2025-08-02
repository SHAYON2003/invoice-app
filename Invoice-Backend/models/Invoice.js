const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {type: String, required: true},
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    items:[
         {
             description: String,
             quantity:Number,
             price:Number,
         }
    ],
    totalAmount :{type: Number , required: true},
    status:{
         type: String,
         enum:['unpaid','paid','overdue'],
         default:'unpaid'
    },
    dueDate:{type:Date, required: true},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Invoice", invoiceSchema)