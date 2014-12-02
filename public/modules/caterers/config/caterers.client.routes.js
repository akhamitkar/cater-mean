'use strict';

//Setting up route
angular.module('caterers').config(['$stateProvider',
	function($stateProvider) {
		// Caterers state routing
		$stateProvider.
		state('listCaterers', {
			url: '/caterers',
			templateUrl: 'modules/caterers/views/list-caterers.client.view.html'
		}).
		state('createCaterer', {
			url: '/caterers/create',
			templateUrl: 'modules/caterers/views/create-caterer.client.view.html'
		}).
		state('viewCaterer', {
			url: '/caterers/:catererId',
			templateUrl: 'modules/caterers/views/view-caterer.client.view.html'
		}).
		state('editCaterer', {
			url: '/caterers/:catererId/edit',
			templateUrl: 'modules/caterers/views/edit-caterer.client.view.html'
		});
	}
]);