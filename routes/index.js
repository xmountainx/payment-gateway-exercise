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

/* payment provider specifed setting */
var Payment = require('../libs/models/').Payment;
var providers = require('../libs/payment-providers');
router.post('/braintree', providers.braintree.executeWithNonce);

var onPaymentCompleted = function(err, context) {
  // paymentId, details, req, res) {
  if (err) {
    debug('fail to complete the payment \n' + err);
    res.render('err', {
      'message' : 'fail to complete the payment' 
    });
  }

  var payment = new Payment();

  payment.paymentId = context.paymentId;
  payment.name = context.params.name;
  payment.phone = context.params.phone[0];
  payment.currency = context.params.currency;
  payment.amount = context.params.price
  payment.provider = context.provider;

  var res = context.res;

  payment.save(function(err) {
    if (err) {
      debug('fail to save the payment \n' + err);
      res.render('err', {
        'message' : 'fail to save the payment' 
      });
    }

    res.render('payment-success', {
      'refCode' : payment.paymentId
    });
  });

};

// register fake event
providers.braintree.onPaymentCompleted = onPaymentCompleted;
providers.paypal.onPaymentCompleted = onPaymentCompleted;

/* Check Payment Route */
var checkPayment = require('./check-payment');

router.get('/check-payment', checkPayment.render);
router.post('/check-payment', checkPayment.handle);

module.exports = router;
