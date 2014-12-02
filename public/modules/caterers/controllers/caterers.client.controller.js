'use strict';

// Caterers controller
angular.module('caterers').controller('CaterersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Caterers',
	function($scope, $stateParams, $location, Authentication, Caterers) {
		$scope.authentication = Authentication;

		// Create new Caterer
		$scope.create = function() {
			// Create new Caterer object
			var caterer = new Caterers ({
				name: this.name
			});

			// Redirect after save
			caterer.$save(function(response) {
				$location.path('caterers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Caterer
		$scope.remove = function(caterer) {
			if ( caterer ) { 
				caterer.$remove();

				for (var i in $scope.caterers) {
					if ($scope.caterers [i] === caterer) {
						$scope.caterers.splice(i, 1);
					}
				}
			} else {
				$scope.caterer.$remove(function() {
					$location.path('caterers');
				});
			}
		};

		// Update existing Caterer
		$scope.update = function() {
			var caterer = $scope.caterer;

			caterer.$update(function() {
				$location.path('caterers/' + caterer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Caterers
		$scope.find = function() {
			$scope.caterers = Caterers.query();
		};

		// Find existing Caterer
		$scope.findOne = function() {
			$scope.caterer = Caterers.get({ 
				catererId: $stateParams.catererId
			});
		};
	}
]);