//-------------------------------------//
//authController, functions needed by the
//authentication services in the app.
//-------------------------------------//

//Needed packages
var config = require('../../config'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),

    google = require('googleapis'),
    googleAuth = require('google-auth-library');

var authController = {};

//Server secret
var secret = config.secret;

//Google authentication info
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    clientId = config.googleAuth.clientID,
    clientSecret = config.googleAuth.clientSecret,
    redirectUrl = config.googleAuth.callbackURL,
    auth = new googleAuth(),
    oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

//Controller's functions

/*Generates the Google Authentication URL with the proper
  access type and permissions.*/
authController.google = function(req, res) {

    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    res.json(authUrl);
};

/*Retrieve an authorized token from google, uses it to retrieve google drive
  profile information and verify if the user exists in the system. If the
  user exists the google token is updated and the user is authenticated locally
  returning a local token, if not creates a new user in the system and
  authenticates him locally. */
authController.googleAuthenticate = function(req, res) {
    oauth2Client.getToken(req.query.code, function(err, token) {
        if (!err) {
            oauth2Client.setCredentials(token);

            var drive = google.drive('v3');
            var googleUser = {};

            drive.about.get({   //Obtain user's basic info
                auth: oauth2Client,
                fields: "user"
            }, function(err, aboutResponse) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'The Drive api returned an error: ' + err
                    });
                }
                googleUser = aboutResponse.user;

                User.findOne({
                    'google.id' : googleUser.permissionId
                }).exec(function(err, user) {
                    if (err) throw err;

                    if (user) { //Log him in

                        //Update his token data

                        user.google.token = token;

                        user.save(function(err) {
                            if (err) send(err);

                            var localToken = jwt.sign({
                                googleId: user.google.id,
                                email: user.google.email,
                            }, secret, {
                                expiresIn: 86400
                            });

                            res.json({
                                success: true,
                                message: 'Enjoy your token',
                                token: localToken
                            });
                        });

                    } else {
                        var newUser = new User();

                        newUser.google.id = googleUser.permissionId;
                        newUser.google.email = googleUser.emailAddress;
                        newUser.google.token = token;

                        newUser.save(function(err)  {
                            if (err) return res.json({
                                success: false,
                                message: 'Error while saving user' + err
                            });

                            var localToken = jwt.sign({
                                googleId: newUser.google.id,
                                email: newUser.google.email,
                            }, secret, {
                                expiresIn: 86400
                            });

                            res.json({
                                success: true,
                                message: 'Enjoy your token',
                                token: localToken
                            });
                        });
                    }
                });

            });
        } else {
            res.json({
                success: false,
                message: 'Authentication failed. Error retrieving token from google',
                error: err
            });
        }
    });
};

//Checks if the caller is providing the correct auth info.
authController.checkPrincipal = function(req, res, next) {
    //Check header or url parameters or post parameters for the token
    var token = req.body.token || req.params.token ||
        req.headers['x-access-token'];

    //decode token
    if (token) {
        //verify secret and check expiration
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
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
    } else { //If there is no token return error message
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};

//Here should come the next routes needed by other services.

module.exports = authController;
