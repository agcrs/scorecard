//-------------------------------------//
//Google Drive routes
//-------------------------------------//

//Needed packages
var express = require('express'),
    driveController = require('../controllers/driveController');
    authController = require('../controllers/authController');

var driveRouter = express.Router();


//---MIDDLEWARE TO CHECK AUTHENTICATION--//
//This middleware checks if the caller is providing the correct auth info.
driveRouter.use(authController.checkPrincipal);

//-----------------ROUTES----------------//
driveRouter.get('/profileInfo', driveController.getProfileInfo);
driveRouter.get('/fileInfo', driveController.getFileInfo);

module.exports = driveRouter;
