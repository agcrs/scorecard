angular.module('driveService', [])

//===============================================
//Drive factory to get information from google drive
//inject $http for communicating with the Api
//inject $q to return promise objects
//===============================================

.factory('Drive', function($http, $q) {

    var driveFactory = {};

    driveFactory.getItems = function(code)  {
        return $http.get('/auth/google/items?code=' + code);
    };

    driveFactory.getUserInfo = function(code)   {
        return $http.get('/auth/google/user?code=' + code);
    };

    driveFactory.getChanges = function(code)    {
        return $http.get('/auth/google/changes?code=' + code);
    };

    return driveFactory;
});
