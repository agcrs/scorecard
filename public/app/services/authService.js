angular.module('authService', [])

//===============================================
//Factory to handle tokens
//inject $window to store token client-side
//===============================================

.factory('AuthToken', function($window) {

    var authTokenFactory = {};

    //get the token
    authTokenFactory.getToken = function()  {
        return $window.localStorage.getItem('token');
    };

    //set the token or clear the token
    authTokenFactory.setToken = function(token) {
        if (token){
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    };

    return authTokenFactory;
})

//===============================================
//Auth factory to login and get information
//inject $http for communicating with the Api
//inject $q to return promise objects
//inject AuthToken to manage tokens
//===============================================

.factory('Auth', function($http, $q, AuthToken) {

    var authFactory = {};

    //handle login
    authFactory.login = function(username, password) {

        //return the promise object an its data
        return $http.post('/api/authenticate', {
            username: username,
            password: password
        })
            .success(function(data) {
                AuthToken.setToken(data.token);
                return data;
            });
    };

    //handle logout
    authFactory.logout = function() {
        //clear the token
        AuthToken.setToken();
    };

    //chek if a user is logged in
    authFactory.isLoggedIn = function() {
        if (AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    //get user info
    authFactory.getUser = function() {
		if (AuthToken.getToken()) {
            return $http.get('/api/me', { cache: true });
        } else {
			return $q.reject({ message: 'User has no token.' });
        }
	};

    authFactory.redirectAuthGoogle = function() {
        return $http.get('/auth/google');
    };

    return authFactory;
})

//===============================================
//Application configuration to integrate token
//into requests.
//===============================================

.factory('AuthInterceptor', function($q, $location, AuthToken) {

    var interceptorFactory = {};

    //attach the token to every request
    interceptorFactory.request = function(config)   {
        var token = AuthToken.getToken();

        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    };

    //redirect if a token doesn't authenticate
    interceptorFactory.responseError = function(response)   {

        if(response.status == 403){ //If server returns forbidden response
            AuthToken.setToken();   //Remove the tokens
            $location.path('/login');   //Redirect to login
        }

        return $q.reject(response); //Return the error from the server as a promise
    };

    return interceptorFactory;
});
