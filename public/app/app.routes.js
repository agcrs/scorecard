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
            templateUrl: 'app/views/dashboard/profile.html',
            controller: 'authGoogleController',
            controllerAs: 'drive'
        })

        //Google Auth Routes
        .when('/profile', { //Redirects to google auth url
            templateUrl: 'app/views/dashboard/profile.html',
            controller: 'driveController',
            controllerAs: 'drive'
        });

        //get rid of the hash in the url
        $locationProvider.html5Mode(true);
});
