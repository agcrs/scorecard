//-------------------------------------//
//Routes needed by the authentication
//services used by the app.
//-------------------------------------//

//Needed packages
var express = require('express'),
    authController = require('../controllers/authController');

var authRouter = express.Router();

//-----------------ROUTES----------------//

//----------Local Auth routes------------//

//----------Google Auth Routes-----------//
authRouter.get('/google', authController.google);
authRouter.get('/google/authenticate', authController.googleAuthenticate);

//Here should come the next routes needed by other services.

module.exports = authRouter;
