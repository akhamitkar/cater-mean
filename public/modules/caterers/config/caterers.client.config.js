'use strict';

// Configuring the Articles module
angular.module('caterers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Caterers', 'caterers', 'dropdown', '/caterers(/create)?');
		Menus.addSubMenuItem('topbar', 'caterers', 'List Caterers', 'caterers');
		Menus.addSubMenuItem('topbar', 'caterers', 'New Caterer', 'caterers/create');
	}
]);