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
            vm.userInfo = data.aboutInfo;
            vm.fileInfo = data.fileInfo;
            vm.processing = false;
            vm.drawStorageChart(data.aboutInfo.storageQuota);
            vm.countFileTypes(data.fileInfo);
            vm.drawFileChart();
        });

    vm.drawStorageChart = function(data) {
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

        var chart = new google.visualization.PieChart(document.getElementById('storageChart'));
        chart.draw(dataChart, options);
    };

    vm.countFileTypes = function(data) {
        vm.oneFile = data;

        vm.totalArchives = data.files.length;
        vm.gDocs = 0;
        vm.gDrawings = 0;
        vm.gForms = 0;
        vm.gMaps = 0;
        vm.gSlides = 0;
        vm.gSheets = 0;
        vm.pdf = 0;
        vm.img = 0;
        vm.zip = 0;
        vm.various = 0;

        for (var i = 0; i < data.files.length; i++) {
            vm.forFile = data.files[i];
            var file = data.files[i];
            if (file.mimeType == 'application/vnd.google-apps.document') vm.gDocs++;
            else if (file.mimeType == 'application/vnd.google-apps.drawing') vm.gDrawings++;
            else if (file.mimeType == 'application/vnd.google-apps.form') vm.gForms++;
            else if (file.mimeType == 'application/vnd.google-apps.map') vm.gMaps++;
            else if (file.mimeType == 'application/vnd.google-apps.presentation') vm.gSlides++;
            else if (file.mimeType == 'application/vnd.google-apps.spreadsheet') vm.gSheets++;
            else if (file.mimeType == 'application/pdf') vm.pdf++;
            else if (file.mimeType == 'image/png') vm.img++;
            else if (file.mimeType == 'image/jpeg') vm.img++;
            else if (file.mimeType == 'image/pjpeg') vm.img++;
            else if (file.mimeType == 'image/jpg') vm.img++;
            else if (file.mimeType == 'application/x-compressed') vm.zip++;
            else if (file.mimeType == 'application/x-zip-compressed') vm.zip++;
            else if (file.mimeType == 'application/zip') vm.zip++;
            else if (file.mimeType == 'multipart/x-zip') vm.zip++;
            else vm.various++;
        }
    };

    vm.drawFileChart = function() {

        var dataChart = google.visualization.arrayToDataTable([
            ['File Type', 'Number of Files'],
            ['Google Docs', vm.gDocs],
            ['Google Drawing', vm.gDrawings],
            ['Google Forms', vm.gForms],
            ['Google Maps', vm.gMaps],
            ['Google Slides', vm.gSlides],
            ['Google Sheets', vm.gSheets],
            ['PDF', vm.pdf],
            ['Images', vm.img],
            ['Compressed', vm.zip],
            ['Various', vm.various],
        ], false);

        var options = {
          title: 'File Formats',
          width: 700,
          height: 500,
          chart: { title: 'File formats',
                   subtitle: 'Number of files of each type' },
          bars: 'horizontal', // Required for Material Bar Charts.
          backgroundColor: 'transparent',
          bar: { groupWidth: "100%" }
        };

        var chart = new google.charts.Bar(document.getElementById('fileChart'));
        chart.draw(dataChart, options);
    };




});
