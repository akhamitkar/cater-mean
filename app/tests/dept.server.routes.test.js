'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dept = mongoose.model('Dept'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dept;

/**
 * Dept routes tests
 */
describe('Dept CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Dept
		user.save(function() {
			dept = {
				name: 'Dept Name'
			};

			done();
		});
	});

	it('should be able to save Dept instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dept
				agent.post('/depts')
					.send(dept)
					.expect(200)
					.end(function(deptSaveErr, deptSaveRes) {
						// Handle Dept save error
						if (deptSaveErr) done(deptSaveErr);

						// Get a list of Depts
						agent.get('/depts')
							.end(function(deptsGetErr, deptsGetRes) {
								// Handle Dept save error
								if (deptsGetErr) done(deptsGetErr);

								// Get Depts list
								var depts = deptsGetRes.body;

								// Set assertions
								(depts[0].user._id).should.equal(userId);
								(depts[0].name).should.match('Dept Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dept instance if not logged in', function(done) {
		agent.post('/depts')
			.send(dept)
			.expect(401)
			.end(function(deptSaveErr, deptSaveRes) {
				// Call the assertion callback
				done(deptSaveErr);
			});
	});

	it('should not be able to save Dept instance if no name is provided', function(done) {
		// Invalidate name field
		dept.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dept
				agent.post('/depts')
					.send(dept)
					.expect(400)
					.end(function(deptSaveErr, deptSaveRes) {
						// Set message assertion
						(deptSaveRes.body.message).should.match('Please fill Dept name');
						
						// Handle Dept save error
						done(deptSaveErr);
					});
			});
	});

	it('should be able to update Dept instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dept
				agent.post('/depts')
					.send(dept)
					.expect(200)
					.end(function(deptSaveErr, deptSaveRes) {
						// Handle Dept save error
						if (deptSaveErr) done(deptSaveErr);

						// Update Dept name
						dept.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dept
						agent.put('/depts/' + deptSaveRes.body._id)
							.send(dept)
							.expect(200)
							.end(function(deptUpdateErr, deptUpdateRes) {
								// Handle Dept update error
								if (deptUpdateErr) done(deptUpdateErr);

								// Set assertions
								(deptUpdateRes.body._id).should.equal(deptSaveRes.body._id);
								(deptUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Depts if not signed in', function(done) {
		// Create new Dept model instance
		var deptObj = new Dept(dept);

		// Save the Dept
		deptObj.save(function() {
			// Request Depts
			request(app).get('/depts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dept if not signed in', function(done) {
		// Create new Dept model instance
		var deptObj = new Dept(dept);

		// Save the Dept
		deptObj.save(function() {
			request(app).get('/depts/' + deptObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dept.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dept instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dept
				agent.post('/depts')
					.send(dept)
					.expect(200)
					.end(function(deptSaveErr, deptSaveRes) {
						// Handle Dept save error
						if (deptSaveErr) done(deptSaveErr);

						// Delete existing Dept
						agent.delete('/depts/' + deptSaveRes.body._id)
							.send(dept)
							.expect(200)
							.end(function(deptDeleteErr, deptDeleteRes) {
								// Handle Dept error error
								if (deptDeleteErr) done(deptDeleteErr);

								// Set assertions
								(deptDeleteRes.body._id).should.equal(deptSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dept instance if not signed in', function(done) {
		// Set Dept user 
		dept.user = user;

		// Create new Dept model instance
		var deptObj = new Dept(dept);

		// Save the Dept
		deptObj.save(function() {
			// Try deleting Dept
			request(app).delete('/depts/' + deptObj._id)
			.expect(401)
			.end(function(deptDeleteErr, deptDeleteRes) {
				// Set message assertion
				(deptDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dept error error
				done(deptDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Dept.remove().exec();
		done();
	});
});