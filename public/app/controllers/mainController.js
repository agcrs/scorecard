//===============================================
//This controller is applied to the overall layout
//of the application.
//It is responsible of holding the logged in and
//logged out user information.
//==============================================

angular.module('mainController', [])

.controller('mainController', ['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {

    var vm = this;  //Set up the view-model

    vm.loggedIn = Auth.isLoggedIn();    //Get info if someone is logged in

    //Check if the user is logged in on every request
    $rootScope.$on('$routeChangeStart', function()  {  //Detect a router change

        vm.loggedIn = Auth.isLoggedIn();

        Auth.getUser() //get user information on route change
            .then(function(data) {
                vm.user = data.data;
            });

    });

    //Function to handle loggin out
    vm.doLogout = function()    {
        Auth.logout();
        vm.user = {};
        vm.loggedIn = false;
        $location.path('/');
    };

}]);
