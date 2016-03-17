var express = require('express');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

var secret = config.secret;

var apiRouter = express.Router();

//Decode the and authenticate the given token.
apiRouter.use(function(req, res, next)  {
    //Check header or url parameters or post parameters for the token
    var token = req.body.token || req.params.token ||
        req.headers['x-access-token'];

    //decode token
    if(token){
        //verify secret and check expiration
        jwt.verify(token, secret, function(err, decoded)   {
            if(err){
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                //If everything good, save to request for use in other routes
                req.decoded = decoded;

                next();
            }
        });
    } else {    //If there is no token return error message
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

//Get the logged user info.
apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
});

module.exports = apiRouter;
