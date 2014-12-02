'use strict';

//Depts service used to communicate Depts REST endpoints
angular.module('depts').factory('Depts', ['$resource',
	function($resource) {
		return $resource('depts/:deptId', { deptId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);