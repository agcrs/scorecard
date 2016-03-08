//===============================================

//==============================================

angular.module('authController', ['authService'])

.controller('authController', function(Auth) {

    var vm = this;  //Set up the view-model

    Auth.redirectAuthGoogle()
        .success(function(data) {
            window.location.replace(data.googleAuthUrl);
        });
});
