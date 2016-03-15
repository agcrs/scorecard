angular.module('driveService', [])

//===============================================
//Drive factory to get information from google drive
//inject $http for communicating with the Api
//inject $q to return promise objects
//===============================================

.factory('Drive', ['$http', '$q', function($http, $q) {

    var driveFactory = {};

    driveFactory.getItems = function(code)  {
        return $http.get('/api/auth/google/items?code=' + code);
    };

    driveFactory.getUserInfo = function(code)   {
        return $http.get('/api/auth/google/user?code=' + code);
    };

    driveFactory.getChanges = function(code)    {
        return $http.get('/api/auth/google/changes?code=' + code);
    };

    driveFactory.countFileTypes = function(data) {
        var res = {};

        res.totalArchives = data.files.length;
        res.gDocs = 0;
        res.gDrawings = 0;
        res.gForms = 0;
        res.gMaps = 0;
        res.gSlides = 0;
        res.gSheets = 0;
        res.pdf = 0;
        res.img = 0;
        res.zip = 0;
        res.various = 0;

        for (var i = 0; i < data.files.length; i++) {
            var file = data.files[i];
            if (file.mimeType == 'application/vnd.google-apps.document') res.gDocs++;
            else if (file.mimeType == 'application/vnd.google-apps.drawing') res.gDrawings++;
            else if (file.mimeType == 'application/vnd.google-apps.form') res.gForms++;
            else if (file.mimeType == 'application/vnd.google-apps.map') res.gMaps++;
            else if (file.mimeType == 'application/vnd.google-apps.presentation') res.gSlides++;
            else if (file.mimeType == 'application/vnd.google-apps.spreadsheet') res.gSheets++;
            else if (file.mimeType == 'application/pdf') res.pdf++;
            else if (file.mimeType == 'image/png') res.img++;
            else if (file.mimeType == 'image/jpeg') res.img++;
            else if (file.mimeType == 'image/pjpeg') res.img++;
            else if (file.mimeType == 'image/jpg') res.img++;
            else if (file.mimeType == 'application/x-compressed') res.zip++;
            else if (file.mimeType == 'application/x-zip-compressed') res.zip++;
            else if (file.mimeType == 'application/zip') res.zip++;
            else if (file.mimeType == 'multipart/x-zip') res.zip++;
            else res.various++;
        }

        return res;
    };

    driveFactory.drawStorageInfoChart = function(data) {
        var res = {};

        res.usage = (parseFloat(data.usage) / 1048576).toFixed(3);
        res.limit = (parseFloat(data.limit) / 1048576).toFixed(3);
        res.free = ((parseFloat(data.limit) - parseFloat(data.usage)) / 1048576).toFixed(3);
        res.usageInDrive = (parseFloat(data.usageInDrive) / 1048576).toFixed(3);
        res.usageInDriveTrash = (parseFloat(data.usageInDriveTrash) / 1048576).toFixed(3);

        res.usedPercentage = parseFloat((res.usage * 100) / res.limit).toFixed(2);

        var dataChart = google.visualization.arrayToDataTable([
            ['Usage Type', 'MB'],
            ['Free', parseInt(res.free)],
            ['Usage in Drive', parseInt(res.usageInDrive)],
            ['Usage in Drive Trash', parseInt(res.usageInDriveTrash)]
        ], false);

        var options = {
            title: 'Percentages',
            is3D: true,
            backgroundColor: 'transparent',
            'width':300,
            'height':200
        };

        var chart = new google.visualization.PieChart(document.getElementById('storageChart'));
        chart.draw(dataChart, options);

        return res;
    };

    driveFactory.drawFileChart = function(data) {

        var dataChart = google.visualization.arrayToDataTable([
            ['File Type', 'Number of Files'],
            ['Google Docs', data.gDocs],
            ['Google Drawing', data.gDrawings],
            ['Google Forms', data.gForms],
            ['Google Maps', data.gMaps],
            ['Google Slides', data.gSlides],
            ['Google Sheets', data.gSheets],
            ['PDF', data.pdf],
            ['Images', data.img],
            ['Compressed', data.zip],
            ['Various', data.various],
        ], false);

        var options = {
            title: 'File Formats',
            width: 800,
            height: 300,
            chart: {
                title: 'File formats',
                subtitle: 'Number of files of each type'
            },
            bars: 'horizontal', // Required for Material Bar Charts.
            backgroundColor: 'transparent',
            bar: {
                groupWidth: "100%"
            }
        };

        var pieOptions = {
            title: 'File Formats',
            width: 250,
            height: 200,
            chart: {
                title: 'File formats',
                subtitle: 'Number of files per type'
            },
            bars: 'horizontal', // Required for Material Bar Charts.
            backgroundColor: 'transparent',
            bar: {
                groupWidth: "100%"
            }
        };

        var chart = new google.charts.Bar(document.getElementById('fileChart'));
        chart.draw(dataChart, options);

        var pieChart = new google.visualization.PieChart(document.getElementById('filePieChart'));
        pieChart.draw(dataChart, pieOptions);


    };



    return driveFactory;
}]);
