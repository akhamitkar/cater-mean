'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders',
	function($scope, $stateParams, $location, Authentication, Orders) {
		$scope.authentication = Authentication;

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				name: this.name,
				department: this.department,
				datetimeofdelivery: this.datetimeofdelivery,
				confroom: this.confroom,
				noofpeople: this.noofpeople,
				caterers: this.caterers,
				foodallergies: this.foodallergies,
				specialrequests: this.specialrequests,
				creditcard: this.creditcard
			});

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if ( order ) {
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove(function() {
					$location.path('orders');
				});
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({
				orderId: $stateParams.orderId
			});
		};
	}
]);