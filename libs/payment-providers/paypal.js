'use strict'

var debug = require('debug')('paypal');
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
      'cvv2': params.cvv,
      'first_name': params.holderFirstName,
      'last_name': params.holderLastName,
      'billing_address' : { /* due to no address provided, use sample */
        'line1': 'xxx',
        'city': 'xxx',
        'state': 'xxx',
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

    paypal.onPaymentCompleted(err, {
      'paymentId' : paymentId,
      'result' :    payment,
      'provider' :  paypal.name,
      'params' :    params,
      'req' :       req,
      'res' :       res
    });
  });

};

paypal.check = function(paymentId, done) {
  var cb = done || function nop() {};
  return sdk.payment.get(paymentId, cb);
};

paypal.onPaymentCompleted = function(err, context) {
  // fake event 
  debug(err);
  debug(context);
};

module.exports = paypal;