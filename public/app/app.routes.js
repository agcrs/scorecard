angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {    //Home page route
            templateUrl : 'app/views/home.html'
        })

        //Google Auth Routes
        .when('/auth/google', { //Redirects to google auth url
            templateUrl: 'app/views/home.html',
            controller: 'authController',
            controllerAs: 'auth'
        })

        .when('/auth/google/callback', {    //Receives the google auth callback
            templateUrl: 'app/views/dashboard/drive.html',
            controller: 'driveController',
            controllerAs: 'drive'
        })

        //Local authentication routes
        .when('/auth/register', {   //Register route
            templateUrl: 'app/views/authentication/register.html',
            controller: '',
            controllerAs: 'register'
        })

        .when('/auth/login', {  //Login route
            templateUrl: 'app/views/authentication/login.html',
            controller: 'mainController',
            controllerAs: 'login'
        });

        //get rid of the hash in the url
        $locationProvider.html5Mode(true);
});
