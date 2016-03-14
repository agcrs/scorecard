var express = require('express');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

var secret = config.secret;

var apiRouter = express.Router();

//middleware for all api requests except the auth one
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

//Test route for the api
apiRouter.get('/', function(req, res)  {
    res.json({  message: 'Api working!'});
});

//Routes that end in /Users
apiRouter.route('/users')

    //create user
    .post(function(req, res)    {
        //Create instance of user model.
        var user = new User();

        //set the atributes of user from the requests
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        //save the user
        user.save(function(err) {

            if (err) {
                //duplicate entry
                if(err.code == 11000){
                    return res.json({
                        success: false,
                        message: 'A user with that username already exists.'});
                } else {
                    return res.send(err);
                }
            }

            res.json({ message: 'User created!'});
        });

    })

    //Get all the users
    .get(function(req, res) {
        User.find(function(err, users)  {
            if(err){
                res.send(err);
            }

            res.json(users);
        });
    });

apiRouter.route('/users/:user_id')

    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user)   {
            if (err) res.send(err);

            res.json(user);
        });
    })

    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user)   {
            if (err) res.send(err);

            //update if the info is new
            if (req.body.name) user.name = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if(req.body.password) user.password = req.body.password;

            //save the user
            user.save(function(err) {
                if (err) res.send(err);

                res.json({ message: 'User updated!'});
            });
        });
    })

    .delete(function(req, res)  {
        User.remove({
            _id: req.params.user_id
        }, function(err,user)   {
            if (err) return res.send(err);

            res.json({ message: 'Succesfully deleted!'});
        });
    });

apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
});

module.exports = apiRouter;
