'use strict';

// Register `document list` component, along with its associated controller and template
angular.
  module('documentList').
    component('documentList', {
    templateUrl: 'components/Document-ListView/document-list.template.html',
    controller: ['cmisService','$log','$scope' ,
      function DocumentListController(cmisService,$log,$scope) {
        $scope.parents = [];

        $scope.breadcrumb = function (index) {
            var selected = $scope.parents[index];
            $scope.parents = $scope.parents.slice(0, index);
            $scope.openFolder(selected.path, selected.name);
        };

        $scope.openFolder = function (path, name) {
           var strPath = "";
            $log.log("checking Path " + path.value)
            if(path.value==undefined)
                {strPath=path}
            else
                {strPath=path.value}
            $log.log("tmpPath = " + strPath);
            cmisService.getChildren(strPath).then(function (response) {
                $scope.nodes = response.data.objects;
                $log.log($scope.nodes);
                $scope.parents.push({
                    path: path.value,
                    name: name.value
                });
            });
        };

        $scope.nodes = $scope.openFolder('', 'Home');
         // $scope.doQuery("");
         // cmisService.doQuery("asas");
      }
    ]
  }).directive('cmisObject', function () {
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
            templateUrl: '/partials/cmisObject.html'
        };
    }).filter('downloadUrl', function (cmisService) {
        return function(objectId, asAttachment) {
           return "#!/preview/" + objectId;
        }
    });