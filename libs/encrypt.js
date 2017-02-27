'use strict'

var config = require('config').get('encrypt');
var crypto = require('crypto');

module.exports = {
  
  encrypt : function (text) {
    var cipher = crypto.createCipher(config.algorithm, config.password);
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');

    return crypted;
  },
   
  decrypt : function (text) {
    var decipher = crypto.createDecipher(config.algorithm, config.password);
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');

    return dec;
  }

};
