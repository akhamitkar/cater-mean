'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var caterers = require('../../app/controllers/caterers.server.controller');

	// Caterers Routes
	app.route('/caterers')
		.get(caterers.list)
		.post(users.requiresLogin, caterers.create);

	app.route('/caterers/:catererId')
		.get(caterers.read)
		.put(users.requiresLogin, caterers.hasAuthorization, caterers.update)
		.delete(users.requiresLogin, caterers.hasAuthorization, caterers.delete);

	// Finish by binding the Caterer middleware
	app.param('catererId', caterers.catererByID);
};
