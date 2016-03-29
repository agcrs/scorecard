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
//This middleware checks if the caller is providing the correct auth info.
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

//----------Google Drive Routes-----------//
// GET /profileInfo returns basic information about the google drive account.
// The structure of the returned data is as follows:
/*
    {
        user: {
            kind
            displayName
            photoLink
            me
            permissionId
            emailAddress
        },
        storageQuota: {
            limit
            usage
            usageInDrive
            usageInDriveTrash
        }
    }
*/
driveRouter.get('/profileInfo', function(req, res) {

    User.findOne({
        'google.id': req.decoded.googleId
    }).exec(function(err, user) {
        if(err) console.log('Error finding user.');

        oauth2Client.setCredentials(user.google.token);

        var drive = google.drive('v3');

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

// GET /fileInfo returns the mimeType information about the files in there
//drive account.
// The structure of the returned data is as follows:
/*
    {
        files: [
            {
                mimeType:
            }
        ]
    }
*/
driveRouter.get('/fileInfo', function(req, res) {

    User.findOne({
        'google.id': req.decoded.googleId
    }).exec(function(err, user) {
        if(err) console.log('Error finding user.');

        oauth2Client.setCredentials(user.google.token);

        var drive = google.drive('v3');

        drive.files.list({
            auth: oauth2Client,
            pageSize: 1000,
            fields: "files(mimeType)"
        }, function(err, fileResponse) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            res.json(fileResponse);
        });
    });
});

module.exports = driveRouter;
