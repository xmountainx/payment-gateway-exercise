'use strict'

var debug = require('debug')('braintree');
var config = require('config');
var sdk = require('braintree');

var encrypt = require('../encrypt');

// setup config
var cfg = config.get('braintree');
cfg.environment = sdk.Environment.Sandbox;

var braintree = {
  'name'  : 'braintree'
};

braintree.execute = function(req, res, params) {
  var gateway = sdk.connect(cfg);

  res.render('braintree', {
    number      : params.cardNum,
    cvv         : params.cvv,
    expirationDate : params.expire,
    ciphertext  : encrypt.encrypt(JSON.stringify(params))
  });
};

braintree.executeWithNonce = function(req, res, next) {
  var gateway = sdk.connect(cfg);
  var params  = JSON.parse(encrypt.decrypt(req.body.secret));
  var nonce = req.body.nonce;

  // https://github.com/braintree/braintree_ruby/issues/41
  // to different currency, multiple of merchantAccountId account need to be created

  gateway.transaction.sale({
    'amount' : params.price,
    // merchantAccountId : merchantAccountIds[params.currency]
    'paymentMethodNonce': nonce,
    'options' : {
      'submitForSettlement': true
    }
  }, function(err, result) {
    var paymentId = !err && result ? result.transaction.id : null;
    braintree.onPaymentCompleted(err, {
      'paymentId' : paymentId,
      'result' :    result,
      'provider' :  braintree.name,
      'params' :    params,
      'req' :       req,
      'res' :       res
    });
  });
};

braintree.check = function(paymentId, done) {
  var gateway = sdk.connect(cfg);
  var cb = done || function nop() {};

  return gateway.transaction.find(paymentId, cb);
};

braintree.onPaymentCompleted = function(err, context) {
  // fake event 
  debug(err);
  debug(context.result);
};

module.exports = braintree;