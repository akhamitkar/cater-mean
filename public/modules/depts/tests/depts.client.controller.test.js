'use strict';

(function() {
	// Depts Controller Spec
	describe('Depts Controller Tests', function() {
		// Initialize global variables
		var DeptsController,
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

			// Initialize the Depts controller.
			DeptsController = $controller('DeptsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dept object fetched from XHR', inject(function(Depts) {
			// Create sample Dept using the Depts service
			var sampleDept = new Depts({
				name: 'New Dept'
			});

			// Create a sample Depts array that includes the new Dept
			var sampleDepts = [sampleDept];

			// Set GET response
			$httpBackend.expectGET('depts').respond(sampleDepts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.depts).toEqualData(sampleDepts);
		}));

		it('$scope.findOne() should create an array with one Dept object fetched from XHR using a deptId URL parameter', inject(function(Depts) {
			// Define a sample Dept object
			var sampleDept = new Depts({
				name: 'New Dept'
			});

			// Set the URL parameter
			$stateParams.deptId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/depts\/([0-9a-fA-F]{24})$/).respond(sampleDept);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dept).toEqualData(sampleDept);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Depts) {
			// Create a sample Dept object
			var sampleDeptPostData = new Depts({
				name: 'New Dept'
			});

			// Create a sample Dept response
			var sampleDeptResponse = new Depts({
				_id: '525cf20451979dea2c000001',
				name: 'New Dept'
			});

			// Fixture mock form input values
			scope.name = 'New Dept';

			// Set POST response
			$httpBackend.expectPOST('depts', sampleDeptPostData).respond(sampleDeptResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dept was created
			expect($location.path()).toBe('/depts/' + sampleDeptResponse._id);
		}));

		it('$scope.update() should update a valid Dept', inject(function(Depts) {
			// Define a sample Dept put data
			var sampleDeptPutData = new Depts({
				_id: '525cf20451979dea2c000001',
				name: 'New Dept'
			});

			// Mock Dept in scope
			scope.dept = sampleDeptPutData;

			// Set PUT response
			$httpBackend.expectPUT(/depts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/depts/' + sampleDeptPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid deptId and remove the Dept from the scope', inject(function(Depts) {
			// Create new Dept object
			var sampleDept = new Depts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Depts array and include the Dept
			scope.depts = [sampleDept];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/depts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDept);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.depts.length).toBe(0);
		}));
	});
}());