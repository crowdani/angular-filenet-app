'use strict';

// Define the `mYApp` module
var myApp = angular.module('myApp', [
  // ...which depends on the `documentList` module
    'ngRoute',
    'core',
    'searchList',
    'preview',
     'datacapturewebcam',
    'datacapturednd',
    'omr.angularFileDnD',
    'ngProgress',
    'documentList'
]);

