'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
  paymentId : String,
  name      : String,
  phone     : String,
  currency  : String,
  amount    : Number,
  provider  : String,
  created_at : {
    type: Date, 
    required: true, 
    default: Date.now 
  },
  updated_at : {
    type: Date, 
    required: true, 
    default: Date.now 
  }
});

PaymentSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});


module.exports = mongoose.model('Payment', PaymentSchema);
;