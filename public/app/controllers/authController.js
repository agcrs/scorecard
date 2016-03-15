//===============================================

//==============================================

angular.module('authController', ['authService'])

.controller('authController', ['Auth', function(Auth) {

    var vm = this;  //Set up the view-model

    Auth.redirectAuthGoogle()
        .success(function(googleAuthUrl) {
            window.location.replace(googleAuthUrl);
        });
}]);
