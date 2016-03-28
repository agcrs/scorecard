//===============================================
//This controller is applied to the google drive dashboard layout (provisional)
//It is responsible of injecting the formatted data to the view.
//==============================================

angular.module('driveController', ['driveService', 'chartService'])

.controller('driveController', ['$location', '$routeParams', 'Drive', 'Charts',
         function($location, $routeParams, Drive, Charts) {

    if ($location.search().error === 'access_denied') {
        window.location.replace('/');
    }

    var vm = this; //Set up the view-model
    vm.processing = true;

    Drive.getProfileInfo()
        .success(function(data) {
            vm.userInfo = data;
            vm.storageInfo = Drive.parseStorageDataInfoToGb(data.storageQuota);
            Charts.drawStorageInfoChart(vm.storageInfo);
            vm.processing = false;
    });


}]);
