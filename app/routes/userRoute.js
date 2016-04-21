//-------------------------------------//
//Routes to get user information
//-------------------------------------//

var express = require('express'),
    userController = require('../controllers/userController');
    authController = require('../controllers/authController');

var userRouter = express.Router();

//Middleware to check authentication.
userRouter.use(authController.checkPrincipal);

//Routes
userRouter.get('/me', userController.getPrincipal);

module.exports = userRouter;
