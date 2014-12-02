'use strict';

// Configuring the Articles module
angular.module('confrooms').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Confrooms', 'confrooms', 'dropdown', '/confrooms(/create)?');
		Menus.addSubMenuItem('topbar', 'confrooms', 'List Confrooms', 'confrooms');
		Menus.addSubMenuItem('topbar', 'confrooms', 'New Confroom', 'confrooms/create');
	}
]);