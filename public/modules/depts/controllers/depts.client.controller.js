'use strict';

// Depts controller
angular.module('depts').controller('DeptsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Depts',
	function($scope, $stateParams, $location, Authentication, Depts) {
		$scope.authentication = Authentication;

		// Create new Dept
		$scope.create = function() {
			// Create new Dept object
			var dept = new Depts ({
				name: this.name
			});

			// Redirect after save
			dept.$save(function(response) {
				$location.path('depts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dept
		$scope.remove = function(dept) {
			if ( dept ) { 
				dept.$remove();

				for (var i in $scope.depts) {
					if ($scope.depts [i] === dept) {
						$scope.depts.splice(i, 1);
					}
				}
			} else {
				$scope.dept.$remove(function() {
					$location.path('depts');
				});
			}
		};

		// Update existing Dept
		$scope.update = function() {
			var dept = $scope.dept;

			dept.$update(function() {
				$location.path('depts/' + dept._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Depts
		$scope.find = function() {
			$scope.depts = Depts.query();
		};

		// Find existing Dept
		$scope.findOne = function() {
			$scope.dept = Depts.get({ 
				deptId: $stateParams.deptId
			});
		};
	}
]);