'use strict';

//Confrooms service used to communicate Confrooms REST endpoints
angular.module('confrooms').factory('Confrooms', ['$resource',
	function($resource) {
		return $resource('confrooms/:confroomId', { confroomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);