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

var driveRouter = express.Router();

//Google authentication info
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    clientId = config.googleAuth.clientID,
    clientSecret = config.googleAuth.clientSecret,
    redirectUrl = config.googleAuth.callbackURL,
    auth = new googleAuth(),
    oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);


//---MIDDLEWARE TO CHECK AUTHENTICATION--//
driveRouter.use(function(req, res, next) {
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
});

//-----------------ROUTES----------------//

//----------Local Auth routes------------//

//----------Google Auth Routes-----------//

driveRouter.get('/profileInfo', function(req, res) {

    User.findOne({
        'google.id': req.decoded.googleId
    }).exec(function(err, user) {
        if(err) console.log('Error finding user.');

        oauth2Client.setCredentials(user.google.token);

        var drive = google.drive('v3');
        var response = {};
        drive.about.get({
            auth: oauth2Client,
            fields: "user, storageQuota"
        }, function(err, aboutResponse) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            res.json(aboutResponse);

        });
    });


});

driveRouter.get('/me', function(req, res) {
    res.send(req.decoded);
});

module.exports = driveRouter;
