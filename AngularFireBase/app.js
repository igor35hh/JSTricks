angular.module('firebaseModule', ['firebase', 'ngSanitize', 'ngRoute']);

angular.module('firebaseModule').controller('BroadcastController', function($scope, broadcastFactory) {
	$scope.isEditable = false;
	$scope.broadcastName='';
	$scope.isButtonEnabled = function() {
		return ($scope.broadcastName === 'undefined') || ($scope.broadcastName.lenght<1);
	};
	$scope.startBroadcast = function() {
		$scope.isEditable = true;
		$scope.broadcastFromFireBase = broadcastFactory.getBroadcast($scope.broadcastName);
		$scope.broadcastFromFireBase.$set('');
		$scope.broadcastFromFireBase.$bind($scope, 'broadcast');
	};
});

angular.module('firebaseModule').controller('BroadcastViewerController', function($scope, broadcastFactory) {
	$scope.dropdownMessage = 'Retrieving broadcasts...';
	$scope.broadcasts = broadcastFactory.getAllBroadcasts();
	$scope.broadcastSelected = function() {
		$scope.broadcast = broadcastFactory.getBroadcast($scope.broadcastToView);
	}
	$scope.broadcasts.$on('loaded', function() {
		$scope.dropdownMessage = 'Select a broadcast';
	});
});

angular.module('firebaseModule').factory('broadcastFactory', function($firebase, FIREBASE_URL) {
	return {
		getBroadcast: function(key) {
			return $firebase(new Firebase(FIREBASE_URL+'/'+key));
		},
		getAllBroadcasts: function() {
			return $firebase(new Firebase(FIREBASE_URL));
		}
	};
});

angular.module('firebaseModule').directive('demoEditor', function(broadcastFactory) {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			scope.$watch('isEditable', function(newValue) {
				elem.attr('contenteditable', newValue);
			});
			elem.on('keyup keydown', function() {
				scope.$apply(function() {
					scope[attrs.model] = elem.html().trim();
				});
			});
		}
	}
});

angular.module('firebaseModule').constant('FIREBASE_URL', 'https://angulardemo-12f91.firebaseio.com/broadcasts');

angular.module('firebaseModule').config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/write', {
		controller: 'BroadcastController',
		templateUrl: '/views/write.html'
	}).when('/view', {
		controller: 'BroadcastViewerController',
		templateUrl: '/views/view.html'
	}).otherwise({
		redirectTo: '/write'
	});
	$locationProvider.html5Mode(true);
})