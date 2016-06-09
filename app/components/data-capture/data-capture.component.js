'use strict';

angular.
  module('datacapture').
    component('datacapture', {
    templateUrl: 'components/data-capture/data-capture.template.html',
    controller: ['$routeParams','dataCapService','$log','$scope','ngProgressFactory','alchemyapi',
      function DataCapController($routeParams,dataCapService,$log,$scope,ngProgressFactory,alchemyapi) {
        var interval = undefined;
        
        $scope.setupFileName = function(){
            $scope.fileName ="SAMPLE";  
        },
            
        $scope.init2 = function () {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.fileName ="SAMPLE";
            $scope.$on('file-dropzone-drop-event', function(mass) { 
                                                        console.log(mass);
                                                        $scope.imaging = mass.targetScope.file;
                 });  
        $scope.options = {
            // forces use of flash in all browsers
            forceFlash: false,

            // the location of the swf file (you can move it if you want)
            relativeSwfLocation:'/bower_components/angular-camera/cam.swf',

            // <video> to render html5 if available with getUserMedia
            videoSelector: '.webcam-live',

            // the div to render the flash object in 
            flashVideoSelector: ".webcam-flash",

            displayWidth: 320,
            displayHeight: 240,

            // delay to use when capturing with burst (interval)
            delay: {
                rtc: 200,
                flash: 50
            },

            // frames per second
            frames: {
                rtc: 12,
                flash: 12
            },

            // callbacks from either flash or getUserMedia
            camAccessSuccess: function () {
                console.log('user accepted');
                $scope.onReady();
            },
            camAccessError: function () {
                alert('user denied cam access');
                $scope.onReady();
            }
        };
            
            //$scope.image = "";
        },
            
        $scope.onReady = function() {
            console.log("Scope : ",$scope)
            console.log('camera is ready with ' + $scope.rtc.type);
        },

        $scope.capture = function() {
            $scope.rtc.capture(function (data) {
                $scope.data = data;
            });
        },

        $scope.burst = function() {
            clearInterval(interval);
            $('#result').html('<img id="loopImage"/>');

            $scope.rtc.captureBurst(function (data) {
                var i = 0;
                interval = setInterval(function () {
                    $scope.data = data[i];
                    i += 1;
                    if (i === (options.frames.flash - 1)) {
                        i = 0;
                    }
                }, 200);
            });
        },

        $scope.$watch('rtc',function(rtc) {
            console.log('rtc: ',rtc)
        }),
        $scope.ChangeMode = function(){
            if($scope.mode == "WebCam"){
                $scope.mode = "DND";
            }else{
                $scope.mode = "WebCam"
            }
        },
        $scope.SendToServer = function(docType){
            $log.log($scope);
          
            $scope.progressbar.reset();
            $scope.progressbar.set(10);   
            $scope.contentOfFile =  "Results";
            if(docType=="Cheques"){
                var rules = "ConvertColor,RecognizeFields,ProcessCheck";
            }else{
              var rules = "ConvertColor,RecognizeFields";  
            }
            console.log("My Image : ",$scope.image);
            dataCapService.readDocument(docType,$scope.image, $scope.fileName,rules,$scope.progressbar,$scope);
            
          }
        $scope.init2();
      }
    ]
 }).directive('dcapObject', function () {
        return {
            restrict: 'EA',
            scope: {
                properties: '=',
                clickHandler: '&clickHandler'
            },
            link: function (scope, element, attrs) {
                        
            },
            templateUrl: '/partials/dcapObject.html'
        };
    })