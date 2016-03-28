angular.module('scorecardApp', [
    'ngAnimate',        //Used to add animations to ngShow and ngHide mainly
    'app.routes',       //The routing of the application
    'authService',      //Service to manage authorization
    'driveService',     //Service to manage drive data
    'chartService',     //Service to draw google charts
    'mainController',   //Controller for the main view
    'authController',   //Controller for the redirection to googleAuth
    'driveController'   //Controller for the drive views
])

//application configuration to integrate token into requests
.config(function($httpProvider) {
    //attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');
});
