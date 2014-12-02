'use strict';

//Setting up route
angular.module('confrooms').config(['$stateProvider',
	function($stateProvider) {
		// Confrooms state routing
		$stateProvider.
		state('listConfrooms', {
			url: '/confrooms',
			templateUrl: 'modules/confrooms/views/list-confrooms.client.view.html'
		}).
		state('createConfroom', {
			url: '/confrooms/create',
			templateUrl: 'modules/confrooms/views/create-confroom.client.view.html'
		}).
		state('viewConfroom', {
			url: '/confrooms/:confroomId',
			templateUrl: 'modules/confrooms/views/view-confroom.client.view.html'
		}).
		state('editConfroom', {
			url: '/confrooms/:confroomId/edit',
			templateUrl: 'modules/confrooms/views/edit-confroom.client.view.html'
		});
	}
]);