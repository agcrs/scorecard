var express = require('express');
var config = require('../../config');

var route = express.Router();


route.get('/example', function(req, res) {
    var mensaje = 'Welcome to Scorecard!';
    console.log(mensaje);
  res.json({ message: mensaje });
});

module.exports = route;
