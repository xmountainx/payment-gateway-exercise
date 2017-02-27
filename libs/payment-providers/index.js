'use strict'

var providers = {};

providers.paypal = require('./paypal');
providers.braintree = require('./braintree');

module.exports = providers;