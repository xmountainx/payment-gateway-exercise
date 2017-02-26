'use strict'

var debug = require('debug')('create-payment');
var config = require('config');
var sdk = require("braintree");

var cfg = config.get('braintree');
cfg.environment = sdk.Environment.Sandbox;


var braintree = {
  'name'  : 'braintree'
};

braintree.execute = function(req, res, params) {
  res.render('braintree');
};

braintree.executeWithNonce = function(req, res, next) {
  var gateway = sdk.connect(cfg);
  var nonce = req.body.nonce;

  gateway.transaction.sale({
    'amount' : params.price,
    'paymentMethodNonce': noice,
    'options' : {
      'submitForSettlement': true
    }
  }, function(err, result) {

    console.log(err, result);

        // console.log(result);
        // var resp = {};
        // if (err == null) {
        //     if (result.success) {
        //         params.ref_code = result.transaction.id;

        //         //store into db
        //         db.createOrder(params, function(dbErr, dbResult) {
        //             if (dbErr != null) {
        //                 console.log(dbErr);
        //                 resp.success = false;
        //                 resp.err_msg = "Payment fail!";
        //             }else{
        //                 //store to cache
        //                 db.getOrder(params.name, params.ref_code, function(err, results, fields){
        //                     cache.addOrder(results[0]);
        //                 })                  
        //                 resp.success = true;
        //                 resp.payment_ref = result.transaction.id;
        //             }
        //             res.send(resp);
        //         });
        //     }else{
        //         resp.success = false;
        //         resp.err_msg = "Payment fail!";
        //         res.send(resp);
        //     }
        // } else {
        //     resp.success = false;
        //     resp.err_msg = "Payment fail!";
        //     res.send(resp);
        // }
    });
}

braintree.check = function(paymentId, done) {
  var cb = done || function nop() {};
  return sdk.payment.get(paymentId, cb);
};

braintree.onPaymentCompleted = function(err, paymentId, details) {
  // fake event 
  debug(err);
  debug(paymentId);
  debug(details)
};

module.exports = braintree;