module.exports = {
    'port': process.env.PORT || 8080,
    //'database' : 'mongodb://localhost:27017/scorecard',
    'database' : 'mongodb://mlab:383137@ds013310.mlab.com:13310/scorecard',
    'secret' : 'secreto',

    'googleAuth': {
        'clientID'      : '919871325061-7jvhm24c0i6eu7f7133fb203si21akh4.apps.googleusercontent.com',
        'clientSecret'  : 'XYZ5DP4PxXSlpMf5uFyvpJnO',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }
};
