//var bodyParser = require('body-parser'); 	// get body-parser
//var config     = require('../../config');

// super secret for creating tokens
//var superSecret = config.secret;

module.exports = function(app, express) {

	var router = express.Router();


router.get('/', function(req, res) {
  res.json({ message: 'Welcome to Scorecard!' });
});

return router;
};
