'use strict';

/**
 * @ngdoc factory
 * @name cardkitApp.themeConfigProvider
 * @description
 * # themeConfigProvider
 * Service in the cardkitApp.
 * Sends a set of config themes based on the name of the state
 */
angular.module('cardkitApp')
  .factory('themeConfigProvider', ['$state', '$http', '$q', '$rootScope', function($state, $http, $q, $rootScope) {
  	return function() {
  		if(angular.isUndefined($rootScope[$state.current.newname])) {
			var url = 'modes/'+$state.current.newname+'.config.json';
			var defaultConfig = $http.get(url).catch(function(err) {
				if(err.status === 404) {
					return [];
				}
	
				return $q.reject(err);
			});
			return $q.all([defaultConfig]).then(function(values){
				$rootScope[$state.current.newname] = values[0].data;
				return values[0].data;
			});
  		} else {
  			return $rootScope[$state.current.newname];
  		}
	};
  }]);
