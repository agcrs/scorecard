//-------------------------------------//
//Drive controller
//-------------------------------------//

//Needed packages
var config = require('../../config'),
    User = require('../models/user'),
    DriveChange = require('../models/driveChange'),
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
        }, function(err, data) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            res.json(data);

        });
    });
};

/*Returns the mimeType information about the files in the
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
        }, function(err, data) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            res.json(data);
        });
    });
};

/* Obtains the startPageToken needed to start querying for future changes
   in the user's drive. Once obtained the token it is stored in the user
   information.
*/
driveController.getChangesStartPageToken = function(req, res) {

    User.findOne({
        'google.id': req.decoded.googleId
    }).exec(function(err, user) {
        if(err) console.log('Error finding user.');

        oauth2Client.setCredentials(user.google.token);

        var drive = google.drive('v3');

        if(user.google.changes.startPageToken) {

            drive.changes.getStartPageToken(function(err, data) {
                user.google.changes.startPageToken = data.startPageToken;

                user.save(function(err) {
                    if (err) send(err);

                    res.json({
                        success: true,
                        message: 'StartPageToken obtained'
                    });
                });
            });

        } else {
            res.json({
                success: false,
                message: 'The user already has an startPageToken'
            });
        }

    });
};

/* Checks if there are pending changes to obtain or if it's going to ask
   for new changes. Then save the new changes to the database and ask for more
   changes if there are any or update the user information with a new startPageToken.
   Ideally this function should be called as the result of a push notification.
*/
driveController.fetchChangesAndSave = function(req, res) {
    User.findOne({
        'google.id': req.decoded.googleId
    }).exec(function(err, user) {
        if(err) console.log('Error finding user.');

        oauth2Client.setCredentials(user.google.token);

        var drive = google.drive('v3');
        var changesToken = {};

        if(user.google.changes.startPageToken){
            changesToken = user.google.changes.startPageToken;
        } else if (user.google.changes.nextPageToken) {
            changesToken = user.google.changes.nextPageToken;
        }

        drive.changes.list({
            pageToken: changesToken,
            pageSize: 1000
        },function(err, data) {

            var changesToSave = [];

            data.changes.forEach(function (element, index, array) {
                var newChange = {
                    user    : user._id,
                    fileId  : element.fileId,
                    removed : element.removed,
                    time    : element.time
                };

                changesToSave.push(newChange);
            });

            //First approach mongoose create (non efficient)
            DriveChange.create(changesToSave, function (err, savedChanges)  {
                if (err) send(err);
                //Cambios guardados en la base de datos
            });

            if(data.newStartPageToken){//If we obtain a newStartPageToken the function ends.

                user.google.changes.nextPageToken = {};
                user.google.changes.startPageToken = data.newStartPageToken;

                user.save(function(err) {
                    if (err) send(err);

                    res.json({
                        success: true,
                        message: 'All changes obtained'
                    });
                });

            } else if (data.nextPageToken) {//If we obtain a nextPageToken we need to fetch the next changes.
                user.google.changes.startPageToken = {};
                user.google.changes.nextPageToken = data.nextPageToken;

                user.save(function(err) {
                    if (err) send(err);

                    driveController.getChanges(req, res);
                });
            }

        });
    });
};

module.exports = driveController;
