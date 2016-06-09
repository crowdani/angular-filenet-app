angular.
  module('myApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/documents', {
          template: '<document-list></document-list>'
        }).
        when('/documents/:docId', {
          template: '<document-detail></document-detail>'
        }).
        when('/Admin',{
          template: '<search-list></search-list>'
        }).
         when('/Search/:queryField',{
          template: '<search-list></search-list>'
        }).
          when('/preview/:id',{
          template: '<preview></preview>'
        }).
          when('/datacapturednd', {
          template: '<datacapturednd></datacapturednd>'
        }).
            when('/datacaptureWebCam', {
            template: '<datacaptureWebCam></datacaptureWebCam>'
        }).
        otherwise('/documents');
    }
  ]);