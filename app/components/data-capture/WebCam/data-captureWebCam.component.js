'use strict';

angular.
  module('datacapturewebcam').
    component('datacapturewebcam', {
    templateUrl: 'components/data-capture/WebCam/data-captureWebCam.template.html',
    controller: ['$routeParams','dataCapService','$log','$scope','ngProgressFactory','Cropper',
      function DataCapControllerWebCam($routeParams,dataCapService,$log,$scope,ngProgressFactory,Cropper,$timeout) {
        var interval = undefined;
        
         /**
   * Croppers container object should be created in controller's scope
   * for updates by directive via prototypal inheritance.
   * Pass a full proxy name to the `ng-cropper-proxy` directive attribute to
   * enable proxing.
   */
  $scope.cropper = {};
  $scope.cropperProxy = 'cropper.first';
  var file;
          var data;
  /**
   * When there is a cropped image to show encode it to base64 string and
   * use as a source for an image element.
   */
  $scope.preview = function() {
      
    if (!file || !data) return;
    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
    console.log(dataUrl);
      ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
    });
  };

  /**
   * Use cropper function proxy to call methods of the plugin.
   * See https://github.com/fengyuanchen/cropper#methods
   */
  $scope.clear = function(degrees) {
    if (!$scope.cropper.first) return;
    $scope.cropper.first('clear');
  };

  $scope.scale = function(width) {
    Cropper.crop(file, data)
      .then(function(blob) {
        return Cropper.scale(blob, {width: width});
      })
      .then(Cropper.encode).then(function(dataUrl) {
        ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
      });
  }

  /**
   * Object is used to pass options to initalize a cropper.
   * More on options - https://github.com/fengyuanchen/cropper#options
   */
  $scope.options = {
    maximize: true,
    aspectRatio: 2 / 1,
    crop: function(dataNew) {
      data = dataNew;
    }
  };  
          console.log("heere we go",$scope);
          $scope.showEvent = 'show';
  $scope.hideEvent = 'hide';   
          //$scope.$broadcast($scope.showEvent);
  function showCropper() { $scope.$broadcast($scope.showEvent); }
          
  function hideCropper() { $scope.$broadcast($scope.hideEvent); }          
          
        $scope.setupFileName = function(){
            $scope.fileName ="SAMPLE";  
        },
            
        $scope.init2 = function () {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.fileName ="SAMPLE";
         
         
        $scope.options = {
            // forces use of flash in all browsers
            forceFlash: false,

            // the location of the swf file (you can move it if you want)
            relativeSwfLocation:'/bower_components/angular-camera/cam.swf',

            // <video> to render html5 if available with getUserMedia
            videoSelector: '.webcam-live',

            // the div to render the flash object in 
            flashVideoSelector: ".webcam-flash",
            
            //displayWidth: 420,
            //displayHeight: 240,

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
          
            console.log('camera is ready with ' + $scope.rtc.type);
        },

        $scope.capture = function() {
            $scope.rtc.capture(function (data) {
                $scope.image = data;
               // $scope.clear(); 
                window.setTimeout(showCropper);  // wait for $digest to set image's src
                //Cropper.replace(data);
            });
        },
       $scope.startCropper =  function(){
            var image =document.getElementById('image');
            console.log(image);
            data = $scope.image;
          image.src = $scope.image;
           var cropper = new Cropper(image, {
            aspectRatio: 16 / 9,responsive: true,
            crop: function(e) {
                $scope.image = e;
                
                console.log(e.detail.x);
                //console.log(e.detail.y);
                //console.log(e.detail.width);
                //console.log(e.detail.height);
                //console.log(e.detail.rotate);
                //console.log(e.detail.scaleX);
                //console.log(e.detail.scaleY);
            }
        });
            cropper.start();
        },
   
        $scope.drawCrop=function(img,crop){
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 4;
            ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
            var dataURL = canvas.toDataURL();
            console.log(dataURL);
            $scope.data = dataURL;
            console.log("Cropped");
        },  
            
        $scope.burst = function() {
            clearInterval(interval);
            $('#result').html('<img id="loopImage"/>');

            $scope.rtc.captureBurst(function (data) {
                var i = 0;
                interval = setInterval(function () {
                    $scope.data = data[i];
                    i += 1;
                    if (i === ($scope.options.frames.flash - 1)) {
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
 }).directive('dcapObjectWebCam', function () {
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