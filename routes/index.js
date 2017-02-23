'use strict'

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});''

/* Create Payment Route */
var createPayment = require('./create-payment');

router.get('/create-payment', createPayment.render);
router.post('/create-payment', createPayment.handle);
router.use(provders.routes);


router.get('/check-payment', function(req, res, next) {
  res.render('check-payment');
});

module.exports = router;
