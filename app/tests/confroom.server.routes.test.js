'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Confroom = mongoose.model('Confroom'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, confroom;

/**
 * Confroom routes tests
 */
describe('Confroom CRUD tests', function() {
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

		// Save a user to the test db and create new Confroom
		user.save(function() {
			confroom = {
				name: 'Confroom Name'
			};

			done();
		});
	});

	it('should be able to save Confroom instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Confroom
				agent.post('/confrooms')
					.send(confroom)
					.expect(200)
					.end(function(confroomSaveErr, confroomSaveRes) {
						// Handle Confroom save error
						if (confroomSaveErr) done(confroomSaveErr);

						// Get a list of Confrooms
						agent.get('/confrooms')
							.end(function(confroomsGetErr, confroomsGetRes) {
								// Handle Confroom save error
								if (confroomsGetErr) done(confroomsGetErr);

								// Get Confrooms list
								var confrooms = confroomsGetRes.body;

								// Set assertions
								(confrooms[0].user._id).should.equal(userId);
								(confrooms[0].name).should.match('Confroom Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Confroom instance if not logged in', function(done) {
		agent.post('/confrooms')
			.send(confroom)
			.expect(401)
			.end(function(confroomSaveErr, confroomSaveRes) {
				// Call the assertion callback
				done(confroomSaveErr);
			});
	});

	it('should not be able to save Confroom instance if no name is provided', function(done) {
		// Invalidate name field
		confroom.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Confroom
				agent.post('/confrooms')
					.send(confroom)
					.expect(400)
					.end(function(confroomSaveErr, confroomSaveRes) {
						// Set message assertion
						(confroomSaveRes.body.message).should.match('Please fill Confroom name');
						
						// Handle Confroom save error
						done(confroomSaveErr);
					});
			});
	});

	it('should be able to update Confroom instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Confroom
				agent.post('/confrooms')
					.send(confroom)
					.expect(200)
					.end(function(confroomSaveErr, confroomSaveRes) {
						// Handle Confroom save error
						if (confroomSaveErr) done(confroomSaveErr);

						// Update Confroom name
						confroom.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Confroom
						agent.put('/confrooms/' + confroomSaveRes.body._id)
							.send(confroom)
							.expect(200)
							.end(function(confroomUpdateErr, confroomUpdateRes) {
								// Handle Confroom update error
								if (confroomUpdateErr) done(confroomUpdateErr);

								// Set assertions
								(confroomUpdateRes.body._id).should.equal(confroomSaveRes.body._id);
								(confroomUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Confrooms if not signed in', function(done) {
		// Create new Confroom model instance
		var confroomObj = new Confroom(confroom);

		// Save the Confroom
		confroomObj.save(function() {
			// Request Confrooms
			request(app).get('/confrooms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Confroom if not signed in', function(done) {
		// Create new Confroom model instance
		var confroomObj = new Confroom(confroom);

		// Save the Confroom
		confroomObj.save(function() {
			request(app).get('/confrooms/' + confroomObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', confroom.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Confroom instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Confroom
				agent.post('/confrooms')
					.send(confroom)
					.expect(200)
					.end(function(confroomSaveErr, confroomSaveRes) {
						// Handle Confroom save error
						if (confroomSaveErr) done(confroomSaveErr);

						// Delete existing Confroom
						agent.delete('/confrooms/' + confroomSaveRes.body._id)
							.send(confroom)
							.expect(200)
							.end(function(confroomDeleteErr, confroomDeleteRes) {
								// Handle Confroom error error
								if (confroomDeleteErr) done(confroomDeleteErr);

								// Set assertions
								(confroomDeleteRes.body._id).should.equal(confroomSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Confroom instance if not signed in', function(done) {
		// Set Confroom user 
		confroom.user = user;

		// Create new Confroom model instance
		var confroomObj = new Confroom(confroom);

		// Save the Confroom
		confroomObj.save(function() {
			// Try deleting Confroom
			request(app).delete('/confrooms/' + confroomObj._id)
			.expect(401)
			.end(function(confroomDeleteErr, confroomDeleteRes) {
				// Set message assertion
				(confroomDeleteRes.body.message).should.match('User is not logged in');

				// Handle Confroom error error
				done(confroomDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Confroom.remove().exec();
		done();
	});
});