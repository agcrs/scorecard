//Needed packages
var express = require('express'),
    config = require('../../config'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),

    google = require('googleapis'),
    googleAuth = require('google-auth-library');


var apiRouter = express.Router();

var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    clientId = config.googleAuth.clientID,
    clientSecret = config.googleAuth.clientSecret,
    redirectUrl = config.googleAuth.callbackURL,
    auth = new googleAuth(),
    oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

apiRouter.get('/drive/fileTypes', function(req, res) {

    oauth2Client.getToken(req.query.code, function(err, token) {
        if (!err) {
            oauth2Client.setCredentials(token);

            //Deberiamos guardarlo en la base de datos

            var drive = google.drive('v3');
            drive.files.list({
                auth: oauth2Client,
                pageSize: 30,
                fields: "nextPageToken, files(id, name, mimeType, createdTime)"
            }, function(err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return;
                }

                res.json(response.files);
            });
        }
    });
});

module.exports = apiRouter;
