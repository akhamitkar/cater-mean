'use strict';

(function() {
	// Confrooms Controller Spec
	describe('Confrooms Controller Tests', function() {
		// Initialize global variables
		var ConfroomsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Confrooms controller.
			ConfroomsController = $controller('ConfroomsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Confroom object fetched from XHR', inject(function(Confrooms) {
			// Create sample Confroom using the Confrooms service
			var sampleConfroom = new Confrooms({
				name: 'New Confroom'
			});

			// Create a sample Confrooms array that includes the new Confroom
			var sampleConfrooms = [sampleConfroom];

			// Set GET response
			$httpBackend.expectGET('confrooms').respond(sampleConfrooms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.confrooms).toEqualData(sampleConfrooms);
		}));

		it('$scope.findOne() should create an array with one Confroom object fetched from XHR using a confroomId URL parameter', inject(function(Confrooms) {
			// Define a sample Confroom object
			var sampleConfroom = new Confrooms({
				name: 'New Confroom'
			});

			// Set the URL parameter
			$stateParams.confroomId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/confrooms\/([0-9a-fA-F]{24})$/).respond(sampleConfroom);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.confroom).toEqualData(sampleConfroom);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Confrooms) {
			// Create a sample Confroom object
			var sampleConfroomPostData = new Confrooms({
				name: 'New Confroom'
			});

			// Create a sample Confroom response
			var sampleConfroomResponse = new Confrooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Confroom'
			});

			// Fixture mock form input values
			scope.name = 'New Confroom';

			// Set POST response
			$httpBackend.expectPOST('confrooms', sampleConfroomPostData).respond(sampleConfroomResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Confroom was created
			expect($location.path()).toBe('/confrooms/' + sampleConfroomResponse._id);
		}));

		it('$scope.update() should update a valid Confroom', inject(function(Confrooms) {
			// Define a sample Confroom put data
			var sampleConfroomPutData = new Confrooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Confroom'
			});

			// Mock Confroom in scope
			scope.confroom = sampleConfroomPutData;

			// Set PUT response
			$httpBackend.expectPUT(/confrooms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/confrooms/' + sampleConfroomPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid confroomId and remove the Confroom from the scope', inject(function(Confrooms) {
			// Create new Confroom object
			var sampleConfroom = new Confrooms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Confrooms array and include the Confroom
			scope.confrooms = [sampleConfroom];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/confrooms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleConfroom);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.confrooms.length).toBe(0);
		}));
	});
}());