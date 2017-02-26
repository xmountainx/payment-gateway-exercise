'use strict'

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* Create Payment Route */
var createPayment = require('./create-payment');

router.get('/create-payment', createPayment.render);
router.post('/create-payment', createPayment.handle);

/* braintree */
var braintree = require('libs/payment-providers/braintree');
router.post('/braintree', braintree.executeWithNonce);

/* Check Payment Route */
var checkPayment = require('./check-payment');

router.get('/check-payment', checkPayment.render);
router.post('/check-payment', checkPayment.handle);

module.exports = router;
