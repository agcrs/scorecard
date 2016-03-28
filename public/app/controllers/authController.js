//===============================================

//==============================================

angular.module('authController', ['authService'])

.controller('authController', ['Auth', function(Auth) {

    var vm = this; //Set up the view-model

    Auth.redirectAuthGoogle()
        .success(function(googleAuthUrl) {
            window.location.replace(googleAuthUrl);
        });
}])

.controller('authGoogleController', ['Auth', 'Drive', '$routeParams', '$location',
    function(Auth, Drive, $routeParams, $location) {

        if ($location.search().error === 'access_denied') {
            window.location.replace('/');
        }

        var vm = this;
        vm.processing = true;

        Auth.googleLogin($routeParams.code)
            .success(function(data) {

                if (data.success) {
                    $location.path('/profile');   //If the user logs in, redirect

                } else {
                    vm.error = data.message;
                }
            });
    }
]);
