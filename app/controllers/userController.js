var express = require('express'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');

var userController = {};

//GET /me returns the logged user info stored in the token.
userController.getPrincipal = function(req, res) {
    res.send(req.decoded);
};

module.exports = userController;
