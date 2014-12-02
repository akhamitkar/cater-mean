'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var confrooms = require('../../app/controllers/confrooms.server.controller');

	// Confrooms Routes
	app.route('/confrooms')
		.get(confrooms.list)
		.post(users.requiresLogin, confrooms.create);

	app.route('/confrooms/:confroomId')
		.get(confrooms.read)
		.put(users.requiresLogin, confrooms.hasAuthorization, confrooms.update)
		.delete(users.requiresLogin, confrooms.hasAuthorization, confrooms.delete);

	// Finish by binding the Confroom middleware
	app.param('confroomId', confrooms.confroomByID);
};
