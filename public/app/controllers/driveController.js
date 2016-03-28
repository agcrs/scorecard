//===============================================
//This controller is applied to the google drive dashboard layout (provisional)
//It is responsible of injecting the formatted data to the view.
//==============================================

angular.module('driveController', ['driveService'])

.controller('driveController', ['$location', '$routeParams', 'Drive',
         function($location, $routeParams, Drive) {

    if ($location.search().error === 'access_denied') {
        window.location.replace('/');
    }

    var vm = this; //Set up the view-model
    vm.processing = true;

    Drive.getProfileInfo()
        .success(function(data) {
            vm.userInfo = data;
            vm.storageInfo = Drive.drawStorageInfoChart(data.storageQuota);
            vm.processing = false;
    });


}]);
