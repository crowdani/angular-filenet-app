'use strict';

angular.module('core.service.alchemyapi').factory('alchemyapi', function ($http) {
    //var baseUrl = 'http://localhost:8080/alfresco/api/-default-/public/cmis/versions/1.1/browser/',
	var baseUrl = 'http://localhost:3000/readEntities'
    //var baseURlExt = 'http://5.10.112.142:9080/fncmis/browser',
    var callback = 'callback=JSON_CALLBACK';

    return {
          getEntities: function (text) {
            return $http.get(baseUrl + '?data='+ text);
        }
        
    
    }
});
                                                   