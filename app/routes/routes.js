var express = require('express');
var router = express.Router();
var controllers = require('../controllers');

// Retrieve all Customers
router.get("/", controllers.customerController.index)
router.get("/customer", controllers.customerController.index)

// Create a new Customer
router.get("/customer/create", controllers.customerController.create);

// Create a new Customer
router.post("/customer/create", controllers.customerController.store);

// Retrieve a single Customer with customerId
router.get("/customer/edit/(:id)", controllers.customerController.edit);

// Update a Customer with customerId
router.post("/customer/edit/(:id)", controllers.customerController.update);

// Delete a Customer with customerId
router.get("/customer/delete(:id)", controllers.customerController.delete);

module.exports = router;