'use strict';

angular.
  module('datacapturednd').
    component('datacapturednd', {
    templateUrl: 'components/data-capture/dnd/data-capturednd.template.html',
    controller: ['$routeParams','dataCapService','$log','$scope','ngProgressFactory','alchemyapi',
      function DataCapControllerDnd($routeParams,dataCapService,$log,$scope,ngProgressFactory,alchemyapi) {
            $scope.setupFileName = function(){
            $scope.fileName ="SAMPLE";  
        },
            
        $scope.init2 = function () {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.fileName ="SAMPLE";            
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

    
        $scope.SendToServer = function(docType){
            $scope.progressbar.reset();
            $scope.progressbar.set(10);   
            $scope.contentOfFile =  "Results";
            if(docType=="Cheques"){
                var rules = "ConvertColor,RecognizeFields,ProcessCheck";
            }else{
              var rules = "ConvertColor,RecognizeFields";  
            }
           dataCapService.readDocument(docType,$scope.image, $scope.fileName,rules,$scope.progressbar,$scope).then(function(response){
               console.log("RTN: ", response)   
               alchemyapi.getEntities(response).then(function(response)
                {;
                    console.log(response);
                                                                       
                });
           });
            
          }
        $scope.init2();
      }
    ]
 }).directive('dcapObjectdnd', function () {
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