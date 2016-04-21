//-------------------------------------//
//Drive controller
//-------------------------------------//

//Needed packages
var config = require('../../config'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),

    google = require('googleapis'),
    googleAuth = require('google-auth-library');

//Secret for the webtoken
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

var driveController = {};

/*Returns basic information about the google drive account.
  The structure of the returned data is as follows:
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
driveController.getProfileInfo = function(req, res) {

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
};

/*Returns the mimeType information about the files in there
  drive account.
  The structure of the returned data is as follows:
    {
        files: [
            {
                mimeType:
            }
        ]
    }
*/
driveController.getFileInfo = function(req, res) {

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
};

module.exports = driveController;
