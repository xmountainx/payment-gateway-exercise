'use strict'

var debug = require('debug')('data-acess');

var mongoose = require('mongoose');
var url = require('config').get('mongo.url');

mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  debug('mongo connected');
});

module.exports = {
  'Payment' : require('./payment')
};