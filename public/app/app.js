angular.module('scorecardApp', [
    'ngAnimate',        //Used to add animations to ngShow and ngHide mainly
    'app.routes'       //The routing of the application
    //'mainController'   //Controller for the main view
]);

//application configuration to integrate token into requests
//.config(function($httpProvider) {
    //attach our auth interceptor to the http requests
    //$httpProvider.interceptors.push('AuthInterceptor');
//});
