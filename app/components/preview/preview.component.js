angular.
  module('preview').
    component('preview', {
    templateUrl: 'components/preview/preview.template.html',
    controller: ['$routeParams','cmisService','$log','$scope',
      function PreviewController($routeParams,cmisService,$log,$scope) {
       
    
        $scope.urlDocument = "http://5.10.112.142:9080/fncmis/browser/ECM/" + 'root?objectId='+ $routeParams.id +'&cmisselector=content';
        
            
          //$log.log($scope.viewerjs);
          $scope.previewDocument = function(){
            //alert(cmisService.getBaseUrl);
        }
        $scope.previewDocument();
      }
    ]
 }).filter('trustUrl', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  });