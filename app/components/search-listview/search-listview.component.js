'use strict';


// Register `search List` component, along with its associated controller and template
angular.
  module('searchList').
    component('searchList', {
    templateUrl: 'components/search-listview/search-listview.template.html',
    controller: ['cmisService','$log','$scope' ,
      function SearchListController(cmisService,$log,$scope) {
        
          $scope.doQuery = function(query){
            cmisService.doQuery(query).then(function (response) {
             
                $scope.nodes = response.data.results;
                $log.log(response.data.results);
            });   
        };
        $scope.doQuery("select * from cmis:document");
      }
    ]
 }).directive('cmisResultObject', function () {
        return {
            restrict: 'EA',
            scope: {
                properties: '=',
                clickHandler: '&clickHandler'
            },
            link: function (scope, element, attrs) {
                scope.click = function () {
                    scope.clickHandler({
                        path: scope.properties['cmis:path'],
                        name: scope.properties['cmis:name']
                    });
                };
            },
            templateUrl: '/partials/cmisResultObject.html'
        };
    }).filter('downloadUrl', function (cmisService) {
        return function(objectId, asAttachment) {
            /*var baseUrl = cmisService.getBaseUrl();
            var downloadUrl = baseUrl + 'root?objectId='+ objectId +'&cmisselector=content';
            if (asAttachment){
                downloadUrl += '&download=attachment';
            }
            */
            alert(objectId);
            return "#!/preview/" + objectId;
            
        }
    });