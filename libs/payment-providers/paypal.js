'use strict'

var debug = require('debug')('create-payment');
var config = require('config');
var sdk = require('paypal-rest-sdk');

var cardTypes = config.get('paypal-card-type-mapping');

sdk.configure(config.get('paypal'));

var paypal = {
  'name' : 'paypal'
};

paypal.execute = function(req, res, params) {
  // create paypal payment json object
  var payment = {};

  payment.intent = 'sale';
  payment.payer = {};
  payment.payer.payment_method = 'credit_card';

  payment.payer.funding_instruments = [];
  payment.payer.funding_instruments.push({
    'credit_card' : {
      'type'   : cardTypes[params.card.card.type],
      'number' : params.cardNum,
      'expire_month': '' + params.expireMonth,
      'expire_year': '' + params.expireYear,
      'cvv2': params.ccv,
      'first_name': params.holderFirstName,
      'last_name': params.holderLastName,
      'billing_address' : { /* due to no address provided, use sample */
        'line1': '52 N Main ST',
        'city': 'Johnstown',
        'state': 'OH',
        'postal_code': '43210',
        'country_code': 'US'
      }
    }
  });

  payment.transactions = [];
  payment.transactions.push({
    amount : {
      total : '' + params.price,
      currency: '' + params.currency,
      details: {
        subtotal : '' + params.price,
        tax      : '0',
        shipping : '0'
      }
    },
    description: 'This is the payment transaction description.'
  });

  debug('Submit direct credit card payment to paypal \n' + JSON.stringify(payment, null, 4));

  sdk.payment.create(payment, function(err, payment) {
    var paymentId = !err && payment ? payment.id : null;
    paypal.onPaymentCompleted(err, payment.id, payment);
  });

};

paypal.check = function(paymentId, done) {
  var cb = done || function nop() {};
  return sdk.payment.get(paymentId, cb);
};

paypal.onPaymentCompleted = function(err, paymentId, details) {
  // fake event 
  debug(err);
  debug(paymentId);
  debug(details)
};

module.exports = paypal;