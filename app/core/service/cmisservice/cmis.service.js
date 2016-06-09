'use strict';

angular.module('core.service.cmisservice').factory('cmisService', function ($http) {
    //var baseUrl = 'http://localhost:8080/alfresco/api/-default-/public/cmis/versions/1.1/browser/',
	var baseUrl = 'http://5.10.112.142:9080/fncmis/browser/ECM/',
    //var baseURlExt = 'http://5.10.112.142:9080/fncmis/browser',
    callback = 'callback=JSON_CALLBACK';

    return {

        getChildren: function (path) {
            return $http.jsonp(baseUrl + 'root/' + path + '?cmisselector=children&succinct=false&' + callback);
        },
        
        getBaseUrl : function(){
            return baseUrl;
        },
        
        getObject : function(id){
            return "";
        },
        doQuery : function(query){
             return $http.jsonp('http://5.10.112.142:9080/fncmis/browser/ECM' + "?cmisselector=query&q=" + query + "&" +  callback);
        }
    }

    
});