'use strict'

var providers = {};

providers.paypal = require('./paypal');
providers.braintree = { 'name' : 'braintree' };

module.exports = providers;