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
            vm.drawChart(data.storageQuota);
        });

    vm.drawChart = function(data) {
        vm.usage = (parseFloat(data.usage) / 1048576).toFixed(3);
        vm.limit = (parseFloat(data.limit) / 1048576).toFixed(3);
        vm.free = ((parseFloat(data.limit) - parseFloat(data.usage)) / 1048576).toFixed(3);
        vm.usageInDrive = (parseFloat(data.usageInDrive) / 1048576).toFixed(3);
        vm.usageInDriveTrash = (parseFloat(data.usageInDriveTrash) / 1048576).toFixed(3);

        vm.usedPercentage = parseFloat((vm.usage * 100) / vm.limit).toFixed(2);

        var dataChart = google.visualization.arrayToDataTable([
            ['Usage Type', 'MB'],
            ['Free', parseInt(vm.free)],
            ['Usage in Drive', parseInt(vm.usageInDrive)],
            ['Usage in Drive Trash', parseInt(vm.usageInDriveTrash)]
        ], false);

        var options = {
            title: 'Percentages',
            is3D: true,
            backgroundColor: 'transparent',
            'width':300,
            'height':300
        };

        var chart = new google.visualization.PieChart(document.getElementById('driveChart'));
        chart.draw(dataChart, options);
    };

});
