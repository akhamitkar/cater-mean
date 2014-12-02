'use strict';

// Confrooms controller
angular.module('confrooms').controller('ConfroomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Confrooms',
	function($scope, $stateParams, $location, Authentication, Confrooms) {
		$scope.authentication = Authentication;

		// Create new Confroom
		$scope.create = function() {
			// Create new Confroom object
			var confroom = new Confrooms ({
				name: this.name
			});

			// Redirect after save
			confroom.$save(function(response) {
				$location.path('confrooms/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Confroom
		$scope.remove = function(confroom) {
			if ( confroom ) { 
				confroom.$remove();

				for (var i in $scope.confrooms) {
					if ($scope.confrooms [i] === confroom) {
						$scope.confrooms.splice(i, 1);
					}
				}
			} else {
				$scope.confroom.$remove(function() {
					$location.path('confrooms');
				});
			}
		};

		// Update existing Confroom
		$scope.update = function() {
			var confroom = $scope.confroom;

			confroom.$update(function() {
				$location.path('confrooms/' + confroom._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Confrooms
		$scope.find = function() {
			$scope.confrooms = Confrooms.query();
		};

		// Find existing Confroom
		$scope.findOne = function() {
			$scope.confroom = Confrooms.get({ 
				confroomId: $stateParams.confroomId
			});
		};
	}
]);