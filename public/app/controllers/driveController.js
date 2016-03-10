//===============================================
//This controller is applied to the google drive dashboard layout (provisional)
//It is responsible of injecting the formatted data to the view.
//==============================================

angular.module('driveController', ['driveService'])

.controller('driveController', function($routeParams, Drive) {

    var vm = this; //Set up the view-model
    vm.processing = true;

    Drive.getUserInfo($routeParams.code)
        .success(function(data) {
            vm.userInfo = data;
            vm.processing = false;
        });



});
