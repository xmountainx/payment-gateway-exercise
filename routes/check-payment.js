'use strict';

// libraries
var debug = require('debug')('check-payment');
var cache = require('cache-manager');
var redisCfg = require('config').get('redis');

var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');
var cache = cacheManager.caching({
    store : redisStore,
    host  : redisCfg.host,
    port  : 6379, // default value
    db    : redisCfg.db,
    ttl   : 600 // default value
});

var providers = require('../libs/payment-providers');
var Payment = require('../libs/models').Payment;

var route = {};

route.render = function(req, res) {
  return res.render('check-payment');
};

route.handle = function(req, res) {
  var refCode = req.body.refCode;
  var name = req.body.name;

  cache.wrap(refCode + '/' + name, function(cb) {
    Payment.findOne({
      paymentId : refCode,
      name      : name
    }, function(err, payment) {
      console.log('Cache not exists, check record now');
        
      if (err || !payment) {
        return cb(new Error('No related record found'));
      }

      var provider = providers[payment.provider];

      provider.check(refCode, function(err, result) {
        if (err || !payment) {
          return cb(new Error('No related record found'));
        }

        cb(null, payment);
      });
    });
  }, { 
    ttl : redisCfg.ttl
  }, function (err, payment) {
    var msg = '';

    if (err || !payment) {
      msg = 'Sorry, no related record found'
    }

    return res.render('check-payment', {
      msg     : msg,
      payment : payment
    });
  });
  
}


module.exports = route;