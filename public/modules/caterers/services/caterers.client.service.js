'use strict';

//Caterers service used to communicate Caterers REST endpoints
angular.module('caterers').factory('Caterers', ['$resource',
	function($resource) {
		return $resource('caterers/:catererId', { catererId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);