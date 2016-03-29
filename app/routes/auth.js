//-------------------------------------//
//Routes needed by the authentication
//services used by the app.
//-------------------------------------//

//Needed packages
var express = require('express'),
    config = require('../../config'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),

    google = require('googleapis'),
    googleAuth = require('google-auth-library');

//Secret for the webtoken
var secret = config.secret;

var authRouter = express.Router();

//Google authentication info
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    clientId = config.googleAuth.clientID,
    clientSecret = config.googleAuth.clientSecret,
    redirectUrl = config.googleAuth.callbackURL,
    auth = new googleAuth(),
    oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

//-----------------ROUTES----------------//

//----------Local Auth routes------------//

//----------Google Auth Routes-----------//

//Generates the auth url and return it.
authRouter.get('/google', function(req, res) {

    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    res.json(authUrl);
});

authRouter.get('/google/authenticate', function(req, res) {
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
});

//Here should come the next routes needed by other services.

module.exports = authRouter;
