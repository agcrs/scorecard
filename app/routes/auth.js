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

//Authentication route
authRouter.post('/authenticate', function(req, res)  {

    //find the user
    User.findOne({
        'local.email': req.body.email
    }).exec(function(err, user) {
        if (err) throw err;

        //if no user found
        if(!user){
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if(user){
            //check if password matches
            var validPassword = user.comparePassword(req.body.password);
            if(!validPassword){
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                var token = jwt.sign({
                    email: user.local.email,
                    googleId: user.google.id,
                }, secret, {
                    expiresIn: 86400 //24 hours
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token
                });
            }
        }
    });
});

//Save user in the db
authRouter.post('/registerUser', function(req, res)    {
    //Create instance of user model.
    var user = new User();

    //set the atributes of user from the requests
    user.local.email = req.body.email;
    user.local.password = req.body.password;

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

        res.json({ message: 'User Registered!'});
    });

});

//----------Google Auth Routes-----------//

//Generates the auth url and return it.
authRouter.get('/google', function(req, res) {

    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    res.json(authUrl);
});

//Receives the google services callback, save the authorization data and
//authenticates the user.
authRouter.get('/google/callbacku', function(req, res) {
    oauth2Client.getToken(req.query.code, function(err, token) {
        if (err) {
            return res.json({
                success: false,
                message: 'Problem with Google authorization token' + err
            });
        } else {
            oauth2Client.setCredentials(token);

            var drive = google.drive('v3'); //Obtain Google user info
            drive.about.get({
                auth: oauth2Client,
                fields: "user"
            }, function(err, response) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'The drive api returned an error:' + err
                    });
                } else {
                    //View if this user exists on the database
                    User.findOne({
                        'google.id': response.user.permissionId
                    }).exec(function(err, user) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: 'The db returned an error: '+ err
                            });
                        } else {
                            if (user) {

                            } else { //Save user
                                var newUser = new User();

                                newUser.google.id = response.user.permissionId;
                                newUser.google.email = response.user.emailAddress;
                                newUser.google.name = response.user.displayName;
                                newUser.google.token = token;

                                newUser.save(function(err) {
                                    if (err) {
                                        return res.json({
                                            success: false,
                                            message: 'Error savin user:' + err
                                        });
                                    } else {

                                    }
                                });
                            }
                        }
                    });

                }

                res.json(response.user);
            });
        }
    });
});

authRouter.get('/google/items', function(req, res) {
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

authRouter.get('/google/changes', function(req, res) {
    oauth2Client.getToken(req.query.code, function(err, token) {
        if (!err) {
            oauth2Client.setCredentials(token);


            var drive = google.drive('v3');
            var pageToken = null;

            drive.changes.getStartPageToken({
                auth: oauth2Client,

            }, function(err, response) {
                pageToken = response.startPageToken;

                drive.changes.list({
                    auth: oauth2Client,
                    pageSize: 1000,
                    pageToken: pageToken,
                    fields: "nextPageToken, changes(fileId, time, file)"
                }, function(err, response) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        return;
                    }
                    console.log('RESPONSE:');
                    console.log(response);

                    res.json(response.changes);
                });

            });

        }
    });
});

authRouter.get('/google/user', function(req, res) {
    oauth2Client.getToken(req.query.code, function(err, token) {
        if (!err) {
            oauth2Client.setCredentials(token);

            //Deberiamos guardarlo en la base de datos

            var drive = google.drive('v3');
            drive.about.get({
                auth: oauth2Client,
                fields: "user"
            }, function(err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return;
                }

                res.json(response.user);
            });
        }
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
