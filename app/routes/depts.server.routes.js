'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var depts = require('../../app/controllers/depts.server.controller');

	// Depts Routes
	app.route('/depts')
		.get(depts.list)
		.post(users.requiresLogin, depts.create);

	app.route('/depts/:deptId')
		.get(depts.read)
		.put(users.requiresLogin, depts.hasAuthorization, depts.update)
		.delete(users.requiresLogin, depts.hasAuthorization, depts.delete);

	// Finish by binding the Dept middleware
	app.param('deptId', depts.deptByID);
};
