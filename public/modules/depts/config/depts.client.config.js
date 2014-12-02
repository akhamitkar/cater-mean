'use strict';

// Configuring the Articles module
angular.module('depts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Depts', 'depts', 'dropdown', '/depts(/create)?');
		Menus.addSubMenuItem('topbar', 'depts', 'List Depts', 'depts');
		Menus.addSubMenuItem('topbar', 'depts', 'New Dept', 'depts/create');
	}
]);