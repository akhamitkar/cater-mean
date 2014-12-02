'use strict';

(function() {
	// Caterers Controller Spec
	describe('Caterers Controller Tests', function() {
		// Initialize global variables
		var CaterersController,
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

			// Initialize the Caterers controller.
			CaterersController = $controller('CaterersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Caterer object fetched from XHR', inject(function(Caterers) {
			// Create sample Caterer using the Caterers service
			var sampleCaterer = new Caterers({
				name: 'New Caterer'
			});

			// Create a sample Caterers array that includes the new Caterer
			var sampleCaterers = [sampleCaterer];

			// Set GET response
			$httpBackend.expectGET('caterers').respond(sampleCaterers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.caterers).toEqualData(sampleCaterers);
		}));

		it('$scope.findOne() should create an array with one Caterer object fetched from XHR using a catererId URL parameter', inject(function(Caterers) {
			// Define a sample Caterer object
			var sampleCaterer = new Caterers({
				name: 'New Caterer'
			});

			// Set the URL parameter
			$stateParams.catererId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/caterers\/([0-9a-fA-F]{24})$/).respond(sampleCaterer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.caterer).toEqualData(sampleCaterer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Caterers) {
			// Create a sample Caterer object
			var sampleCatererPostData = new Caterers({
				name: 'New Caterer'
			});

			// Create a sample Caterer response
			var sampleCatererResponse = new Caterers({
				_id: '525cf20451979dea2c000001',
				name: 'New Caterer'
			});

			// Fixture mock form input values
			scope.name = 'New Caterer';

			// Set POST response
			$httpBackend.expectPOST('caterers', sampleCatererPostData).respond(sampleCatererResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Caterer was created
			expect($location.path()).toBe('/caterers/' + sampleCatererResponse._id);
		}));

		it('$scope.update() should update a valid Caterer', inject(function(Caterers) {
			// Define a sample Caterer put data
			var sampleCatererPutData = new Caterers({
				_id: '525cf20451979dea2c000001',
				name: 'New Caterer'
			});

			// Mock Caterer in scope
			scope.caterer = sampleCatererPutData;

			// Set PUT response
			$httpBackend.expectPUT(/caterers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/caterers/' + sampleCatererPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid catererId and remove the Caterer from the scope', inject(function(Caterers) {
			// Create new Caterer object
			var sampleCaterer = new Caterers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Caterers array and include the Caterer
			scope.caterers = [sampleCaterer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/caterers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCaterer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.caterers.length).toBe(0);
		}));
	});
}());