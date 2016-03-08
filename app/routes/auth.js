var express = require('express');
var config = require('../../config');

var google = require('googleapis');
var googleAuth = require('google-auth-library');

var secret = config.secret;

var authRouter = express.Router();

var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
var clientId = config.googleAuth.clientID;
var clientSecret = config.googleAuth.clientSecret;
var redirectUrl = config.googleAuth.callbackURL;
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

authRouter.get('/google', function(req, res)  {

    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    res.json({ googleAuthUrl: authUrl });
});

authRouter.get('/google/callback:code', function(req, res)  {
    console.log(req.params);

    oauth2Client.getToken(req.params.code, function(err, token)    {
        if(!err){
            oauth2Client.setCredentials(token);

            //Deberiamos guardarlo en la base de datos
        }
    });

    var service = google.drive('v3');
    service.files.list({
      auth: oauth2Client,
      pageSize: 10,
      fields: "nextPageToken, files(id, name)"
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var files = response.files;
      if (files.length === 0) {
        console.log('No files found.');
      } else {
        console.log('Files:');
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log('%s (%s)', file.name, file.id);
        }
      }

      res.json({data: files});
    });

});


/*function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}*/



module.exports = authRouter;
