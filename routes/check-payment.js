'use strict';

// libraries
var debug = require('debug')('check-payment');

var route = {};

route.render = function(req, res) {
  return res.render('create-payment', {
    'params' : req.body
  });
};

route.handle = function(req, res) {
  res.send('test');
}


module.exports = route;