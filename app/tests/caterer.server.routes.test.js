'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Caterer = mongoose.model('Caterer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, caterer;

/**
 * Caterer routes tests
 */
describe('Caterer CRUD tests', function() {
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

		// Save a user to the test db and create new Caterer
		user.save(function() {
			caterer = {
				name: 'Caterer Name'
			};

			done();
		});
	});

	it('should be able to save Caterer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Caterer
				agent.post('/caterers')
					.send(caterer)
					.expect(200)
					.end(function(catererSaveErr, catererSaveRes) {
						// Handle Caterer save error
						if (catererSaveErr) done(catererSaveErr);

						// Get a list of Caterers
						agent.get('/caterers')
							.end(function(caterersGetErr, caterersGetRes) {
								// Handle Caterer save error
								if (caterersGetErr) done(caterersGetErr);

								// Get Caterers list
								var caterers = caterersGetRes.body;

								// Set assertions
								(caterers[0].user._id).should.equal(userId);
								(caterers[0].name).should.match('Caterer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Caterer instance if not logged in', function(done) {
		agent.post('/caterers')
			.send(caterer)
			.expect(401)
			.end(function(catererSaveErr, catererSaveRes) {
				// Call the assertion callback
				done(catererSaveErr);
			});
	});

	it('should not be able to save Caterer instance if no name is provided', function(done) {
		// Invalidate name field
		caterer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Caterer
				agent.post('/caterers')
					.send(caterer)
					.expect(400)
					.end(function(catererSaveErr, catererSaveRes) {
						// Set message assertion
						(catererSaveRes.body.message).should.match('Please fill Caterer name');
						
						// Handle Caterer save error
						done(catererSaveErr);
					});
			});
	});

	it('should be able to update Caterer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Caterer
				agent.post('/caterers')
					.send(caterer)
					.expect(200)
					.end(function(catererSaveErr, catererSaveRes) {
						// Handle Caterer save error
						if (catererSaveErr) done(catererSaveErr);

						// Update Caterer name
						caterer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Caterer
						agent.put('/caterers/' + catererSaveRes.body._id)
							.send(caterer)
							.expect(200)
							.end(function(catererUpdateErr, catererUpdateRes) {
								// Handle Caterer update error
								if (catererUpdateErr) done(catererUpdateErr);

								// Set assertions
								(catererUpdateRes.body._id).should.equal(catererSaveRes.body._id);
								(catererUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Caterers if not signed in', function(done) {
		// Create new Caterer model instance
		var catererObj = new Caterer(caterer);

		// Save the Caterer
		catererObj.save(function() {
			// Request Caterers
			request(app).get('/caterers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Caterer if not signed in', function(done) {
		// Create new Caterer model instance
		var catererObj = new Caterer(caterer);

		// Save the Caterer
		catererObj.save(function() {
			request(app).get('/caterers/' + catererObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', caterer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Caterer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Caterer
				agent.post('/caterers')
					.send(caterer)
					.expect(200)
					.end(function(catererSaveErr, catererSaveRes) {
						// Handle Caterer save error
						if (catererSaveErr) done(catererSaveErr);

						// Delete existing Caterer
						agent.delete('/caterers/' + catererSaveRes.body._id)
							.send(caterer)
							.expect(200)
							.end(function(catererDeleteErr, catererDeleteRes) {
								// Handle Caterer error error
								if (catererDeleteErr) done(catererDeleteErr);

								// Set assertions
								(catererDeleteRes.body._id).should.equal(catererSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Caterer instance if not signed in', function(done) {
		// Set Caterer user 
		caterer.user = user;

		// Create new Caterer model instance
		var catererObj = new Caterer(caterer);

		// Save the Caterer
		catererObj.save(function() {
			// Try deleting Caterer
			request(app).delete('/caterers/' + catererObj._id)
			.expect(401)
			.end(function(catererDeleteErr, catererDeleteRes) {
				// Set message assertion
				(catererDeleteRes.body.message).should.match('User is not logged in');

				// Handle Caterer error error
				done(catererDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Caterer.remove().exec();
		done();
	});
});