'use strict'

// libraries
var debug = require('debug')('create-payment');
var phone = require('phone');
var valid = require('card-validator');
var types = require('credit-card-type').types;

var payments = require('../libs/payment-providers');

// const
var CURRENCY_LIST = ['HKD', 'USD', 'AUD', 'EUR', 'JPY', 'CNY'];

// RouteObject
var route = {};

route.render = function(req, res) {
  return res.render('create-payment', {
    'errors' : req.errors,
    'supportedCurrencies' : CURRENCY_LIST,
    'params' : req.body
  });
};

route.handle = function(req, res) {
  var params = route.extractParams(req);

  // validate parameters
  route.validate(req, params);
  if (req.errors) {
    debug('Validation error occurred when Creating Payment, details: \n' + req.errors);
    return route.render(req, res);
  }

  // select Payment
  var provider = route.selectProvider(req, params);
  if (req.errors) {
    debug('Payment adatper selection error occurred when Creating Payment, details: \n' + req.errors);
    return route.render(req, res);
  } else if (!provider) {
    req.errors = ['No possible payment provider is available'];
    debug('No possible payment provider is available');

    return route.render(req, res);
  }

  res.send(provider);
};

route.extractParams = function(req) {
  var params = {
    'name'     : req.body.customerName,
    'areaCode' : req.body.areaCode,
    'phoneNum' : req.body.phoneNumber,
    'currency' : req.body.currency,
    'price'    : req.body.price,
    'holder'   : req.body.creditCardHolderName,
    'cardNum'  : req.body.creditCardNumber,
    'expire'   : req.body.creditCardExpiration,
    'ccv'      : req.body.creditCardCcv
  };

  params.phone = phone('+' + params.areaCode + ' ' + params.phoneNum);
  params.card  = valid.number(params.cardNum);

  var expire = params.expire.split('/');
  if (expire.length === 2) {
    params.expireMonth = parseInt(expire[0]);
    params.expireYear = parseInt(expire[1]);
  }

  debug('Creating Payment with params: ' + JSON.stringify(params, null, 4));
  return params;
};

route.validate = function(req, params) {
  var errors = [];

  // basic validate input params
  if (!params.name) {
    errors.push('Name cannot be empty');
  }
  if (!params.areaCode || !params.phoneNum) {
    errors.push('AreaCode and PhoneNumber cannot be empty'); 
  } else if (params.phone.length === 0) {
    errors.push('AreaCode or PhoneNumber format is not correct'); 
  }
  if (!params.currency) {
    errors.push('Currency cannot be empty');
  } else if (CURRENCY_LIST.indexOf(params.currency) === -1) {
    errors.push('Selected Currency doesn\'t support');
  }
  if (!params.price) {
    errors.push('Price cannot be empty');
  } else if (isNaN(params.price)) {
    errors.push('Price must be a number');
  }
  if (!params.holder) {
    errors.push('Credit Card Holder Name cannot be empty');
  }
  if (!params.cardNum) {
    errors.push('Credit Card Number cannot be empty');
  } else if (!params.card.isPotentiallyValid) {
    errors.push('Credit Card Number is not valid');
  }
  if (!params.expire) {
    errors.push('Credit Card Expiration cannot be empty');
  } else if (!params.expireMonth || params.expireMonth < 1 || params.expireMonth > 12 || !params.expireYear) {
    errors.push('Credit Card Expiration is not valid');
  }
  if (!params.ccv) {
    errors.push('Credit Card CCV cannot be empty');
  }

  if (errors.length > 0) {
    req.errors = errors;
  }
};

route.selectProvider = function(req, params) {
  var card = params.card.card;
  var provider;

  if (card.type === 'american-express') {
    if (params.currency === 'USD') {
      provider = payments.paypal;
    } else {
      req.errors = ['AMEX is possible to use only for USD'];
    }
  } else if (['USD', 'EUR', 'AUD'].indexOf(params.currency) != -1) {
    provider = payments.paypal;
  } else {
    provider = payments.braintree;
  }

  return provider;
}

module.exports = route;