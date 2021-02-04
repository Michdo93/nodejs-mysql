const var_dump = require('var_dump')

const Customer = require("../models/customer.model.js");
var customerController = function() {}

customerController.index = function(req, res, next) {
    Customer.getAll((err, data) => {
        if (err) {
            throw err;
        } else {
            res.render('customer/index', {
                title: 'Customer Listing',
                customers: data
            });
        }

    });
}

customerController.create = function(req, res, next) {
    res.render('customer/create', {
        title: 'Add Customer'
    });
}

customerController.store = function(req, res) {
    req.assert('email', 'E-Mail is required').notEmpty();
    req.assert('name', 'Name is required').notEmpty()
    
    var errors = req.validationErrors();
    if (!errors) {
        var customer={
            email:req.sanitize('email').escape().trim(),
            name:req.sanitize('name').escape().trim(),
        }
        
        Customer.create(customer, err => {
            if (err) {
                req.flash('error', 'There was error in insertig data.');
                res.redirect('/customer');
            } else {
                req.flash('success', 'Customer added succesfully.');
                res.redirect('/customer');
            }      
        });
    } else {
        var err_msg = "";
        errors.forEach(function(err) {
            err_msg += err.msg + "<br/>";
        })
        req.flash('error', err_msg);
        res.render('customer/create', {
            title: 'Add Customer'
        });
    }
}

customerController.edit = function(req, res) {
    var customerId = req.params.id;

    console.log("THE ID IS ${customerId}")

    Customer.findById(customerId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                req.flash('error', 'Not found Customer with id ${customerId}.');
                res.redirect('/customer');
            } else {
                req.flash('error', "Error retrieving Customer with id " + customerId);
                res.redirect('/customer');
            }
        } else {
            console.log(data)
            res.render('customer/edit', {
                title: 'Edit Customer',
                customer: data
            });
        }
    });
}

customerController.update = function(req, res) {
    var customerId = req.params.id;

    req.assert('email', 'E-Mail is required').notEmpty();
    req.assert('name', 'Name is required').notEmpty()
    
    var errors = req.validationErrors();
    if (!errors) {
        var customer={
            email:req.sanitize('email').escape().trim(),
            name:req.sanitize('name').escape().trim(),
        }
        
        Customer.updateById(customerId, customer, result => {
            if (result.affectedRows==1) {
                req.flash('success', 'Customer Information update successfully.');
                res.redirect('/customer');
            } else {
                req.flash('error', 'There was error in updating customer.');
                res.redirect('/customer/edit/' + customerId);
            }      
        });
    } else {
        var err_msg = "";
        errors.forEach(function(err) {
            err_msg += err.msg + "<br/>";
        })
        req.flash('error', err_msg);
        res.redirect('/customer/edit/' + customerId);
    }
}

customerController.delete = function(req, res) {
    var customerId = req.params.id;

    Customer.remove(req.con, customerId, function(err) {
        if (err) {
            if (err.kind === "not_foudnd") {
                req.flash('error', 'Not found Customer with id ${req.params.customerId}.');
                res.redirect('/customer');
            } else {
                req.flash('error', "Error retrieving Customer with id " + req.params.customerId);
                res.redirect('/customer');
            }
        } else {
            res.redirect("/customer")
        }
    });
}

module.exports = customerController;