angular.module('driveService', [])

//===============================================
//Drive factory to get information from google drive
//inject $http for communicating with the Api
//inject $q to return promise objects
//===============================================

.factory('Drive', ['$http', '$q', function($http, $q) {

    var driveFactory = {};

    driveFactory.getProfileInfo = function()    {
        return $http.get('/api/drive/profileInfo');
    };

    driveFactory.getItemsInfo = function()  {
        return $http.get('/api/drive/fileInfo');
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

    driveFactory.parseStorageDataInfoToGb = function(data) {
        var res = {};

        res.usage = (parseFloat(data.usage) / 1048576).toFixed(3);
        res.limit = (parseFloat(data.limit) / 1048576).toFixed(3);
        res.free = ((parseFloat(data.limit) - parseFloat(data.usage)) / 1048576).toFixed(3);
        res.usageInDrive = (parseFloat(data.usageInDrive) / 1048576).toFixed(3);
        res.usageInDriveTrash = (parseFloat(data.usageInDriveTrash) / 1048576).toFixed(3);

        res.usedPercentage = parseFloat((res.usage * 100) / res.limit).toFixed(2);

        return res;
    };



    return driveFactory;
}]);
