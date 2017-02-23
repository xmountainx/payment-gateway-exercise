'use strict'

var debug = require('debug')('create-payment');
var config = require('config');
var sdk = require('paypal-rest-sdk');

var TYPE_MAPPING = {
  'visa' : 'visa',
  'master-card' : 'mastercard',
  'american-express' : 'amex',
  'discover' : 'discover',
  'jcb' : 'jcb'
};

sdk.configure(config.get('paypal'));

var paypal = {};

paypal.process = function(req, res, params) {
  // create paypal payment json object
  var payment = {};

  payment.intent = 'sale';
  payment.payer = {};
  payment.payer.payment_method = 'credit_card';

  payment.payer.funding_instruments = [];
  payment.payer.funding_instruments.push({
    'credit_card' : {
      'type'   : TYPE_MAPPING[params.card.card.type],
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
    if (err) {
      console.log('err');
      console.log(JSON.stringify(err, null, 4));
      throw err;
    } else {
      console.log("Create Payment Response");
      console.log(JSON.stringify(payment, null, 4));
    }
  });

};

module.exports = paypal;