//BASE SETUP
//===================================================================

//CALL THE PACKAGES -------------------------------------------------
var express = require('express'); //call express
var bodyParser = require('body-parser');  //get body-parser
var morgan = require('morgan'); //used to see requests
var mongoose = require('mongoose'); //orm
var config = require('./config');//config variables
var path = require('path');

//Models

//Routes
var authRouter = require('./app/routes/auth');
//var routes = require('./app/routes/routes');
var apiRouter = require('./app/routes/api');

var app = express();  //Define the app using express

//APP CONFIGURATION =================================================

//Use body-parser so we cang grab information from POST requests.
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

//Configure the app to handle CORS requests. This allows any domain to access
// our api.
app.use(function(req, res, next)  {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers',
        'X-Requested-With, Content-Type, Authorization');

  next();
});

//Log requests to the console
app.use(morgan('dev'));
//Database
mongoose.connect(config.database);
//Static files location (frontend)
app.use(express.static(__dirname + '/public'));

//ROUTES
// ==================================================================
//app.use('/api', routes);
app.use('/api', apiRouter);
app.use('/auth', authRouter);

//Catchall route to send users to the frontend
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ==================================================================
app.listen(config.port);
console.log('Server listening on port: ' + config.port);
