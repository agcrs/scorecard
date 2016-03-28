angular.module('chartService', [])

//===============================================
//Angular factory to draw data in google charts.
//===============================================

.factory('Charts', ['$http', '$q', function($http, $q) {

    var chartFactory = {};

    chartFactory.drawStorageInfoChart = function(data) {

        var dataChart = google.visualization.arrayToDataTable([
            ['Usage Type', 'MB'],
            ['Free', parseInt(data.free)],
            ['Usage in Drive', parseInt(data.usageInDrive)],
            ['Usage in Drive Trash', parseInt(data.usageInDriveTrash)]
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

    };

    chartFactory.drawFileChart = function(data) {

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

    return chartFactory;
}]);
