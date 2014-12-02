'use strict';

//Setting up route
angular.module('depts').config(['$stateProvider',
	function($stateProvider) {
		// Depts state routing
		$stateProvider.
		state('listDepts', {
			url: '/depts',
			templateUrl: 'modules/depts/views/list-depts.client.view.html'
		}).
		state('createDept', {
			url: '/depts/create',
			templateUrl: 'modules/depts/views/create-dept.client.view.html'
		}).
		state('viewDept', {
			url: '/depts/:deptId',
			templateUrl: 'modules/depts/views/view-dept.client.view.html'
		}).
		state('editDept', {
			url: '/depts/:deptId/edit',
			templateUrl: 'modules/depts/views/edit-dept.client.view.html'
		});
	}
]);