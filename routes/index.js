'use strict'

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/create-payment', function(req, res, next) {
  res.render('create-payment');
});

router.post('/create-payment', function(req, res, next) {

  

});


router.get('/check-payment', function(req, res, next) {
  res.render('check-payment');
});

module.exports = router;
