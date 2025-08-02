const express = require('express')

const{
      createCustomer,
      getCustomers,
      getCustomerById,
      updateCustomer,
      deleteCustomer

} = require('../controllers/customerController')

const router = express.Router()

router.post('/create', createCustomer);
router.get('/', getCustomers);
router.get('/get/:id', getCustomerById);
router.put('/update/:id', updateCustomer);
router.delete('/remove/:id', deleteCustomer);

module.exports = router