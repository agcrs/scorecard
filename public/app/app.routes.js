angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {    //Home page route
            templateUrl : 'app/views/pages/home.html'
        })

        .when('/auth/google', {
            templateUrl: 'app/views/pages/home.html',
            controller: 'authController',
            controllerAs: 'auth'
        });

        //get rid of the hash in the url
        $locationProvider.html5Mode(true);
});
