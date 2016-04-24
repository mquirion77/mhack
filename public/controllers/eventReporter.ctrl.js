/**
 * Event reporter Controller
 */
(function(angular) {
	angular
		.module('collaboratio.app')

		.controller('EventReporterController', [
			'$scope',
			'$rootScope',
			'$mdSidenav',
			'$window',
			'GoogleUtils',
			'ZapUtils',
			'NgMap',
			function($scope, $rootScope, $mdSidenav, $window, GoogleUtils, ZapUtils,NgMap) {

				$scope.toggleSidenav = function(menuId) {
					$mdSidenav(menuId).toggle();
				};

				$scope.recenter = function() {
					$scope.map.setCenter(new google.maps.LatLng($scope.lat, $scope.lng));
				};

				/**
				 * https://snazzymaps.com/style/1/pale-dawn
				 * */
				$scope.styles = [{
					"featureType": "all",
					"elementType": "labels.text.fill",
					"stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
				}, {
					"featureType": "all",
					"elementType": "labels.text.stroke",
					"stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
				}, {"featureType": "all", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {
					"featureType": "administrative",
					"elementType": "all",
					"stylers": [{"visibility": "off"}]
				}, {
					"featureType": "administrative",
					"elementType": "geometry.fill",
					"stylers": [{"color": "#fefefe"}, {"lightness": 20}]
				}, {
					"featureType": "administrative",
					"elementType": "geometry.stroke",
					"stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
				}, {
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [{"lightness": 20}, {"color": "#ececec"}]
				}, {
					"featureType": "landscape.man_made",
					"elementType": "all",
					"stylers": [{"visibility": "on"}, {"color": "#f0f0ef"}]
				}, {
					"featureType": "landscape.man_made",
					"elementType": "geometry.fill",
					"stylers": [{"visibility": "on"}, {"color": "#f0f0ef"}]
				}, {
					"featureType": "landscape.man_made",
					"elementType": "geometry.stroke",
					"stylers": [{"visibility": "on"}, {"color": "#d4d4d4"}]
				}, {"featureType": "landscape.natural", "elementType": "all", "stylers": [{"visibility": "on"}, {"color": "#ececec"}]}, {
					"featureType": "poi",
					"elementType": "all",
					"stylers": [{"visibility": "on"}]
				}, {"featureType": "poi", "elementType": "geometry", "stylers": [{"lightness": 21}, {"visibility": "off"}]}, {
					"featureType": "poi",
					"elementType": "geometry.fill",
					"stylers": [{"visibility": "on"}, {"color": "#d4d4d4"}]
				}, {"featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#303030"}]}, {
					"featureType": "poi",
					"elementType": "labels.icon",
					"stylers": [{"saturation": "-100"}]
				}, {"featureType": "poi.attraction", "elementType": "all", "stylers": [{"visibility": "on"}]}, {
					"featureType": "poi.business",
					"elementType": "all",
					"stylers": [{"visibility": "on"}]
				}, {"featureType": "poi.government", "elementType": "all", "stylers": [{"visibility": "on"}]}, {
					"featureType": "poi.medical",
					"elementType": "all",
					"stylers": [{"visibility": "on"}]
				}, {"featureType": "poi.park", "elementType": "all", "stylers": [{"visibility": "on"}]}, {
					"featureType": "poi.park",
					"elementType": "geometry",
					"stylers": [{"color": "#dedede"}, {"lightness": 21}]
				}, {"featureType": "poi.place_of_worship", "elementType": "all", "stylers": [{"visibility": "on"}]}, {
					"featureType": "poi.school",
					"elementType": "all",
					"stylers": [{"visibility": "on"}]
				}, {
					"featureType": "poi.school",
					"elementType": "geometry.stroke",
					"stylers": [{"lightness": "-61"}, {"gamma": "0.00"}, {"visibility": "off"}]
				}, {"featureType": "poi.sports_complex", "elementType": "all", "stylers": [{"visibility": "on"}]}, {
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [{"color": "#ffffff"}, {"lightness": 17}]
				}, {
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
				}, {
					"featureType": "road.arterial",
					"elementType": "geometry",
					"stylers": [{"color": "#ffffff"}, {"lightness": 18}]
				}, {"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#ffffff"}, {"lightness": 16}]}, {
					"featureType": "transit",
					"elementType": "geometry",
					"stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
				}, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#dadada"}, {"lightness": 17}]}];

				$scope.addEvent = function() {
					$mdSidenav('addEventSideNav').toggle();
				};

				$scope.editEvent = function(event) {
					$rootScope.$broadcast('edit', $scope.events[parseInt(event.currentTarget.childNodes[1].id.replace('custom-marker-', '') - 1)]);
					$mdSidenav('addEventSideNav').toggle();
				};

				$scope.setupScope = function() {
					$scope.label = "Event reporter";
					$scope.showAireAmenagee = true;
					$scope.showItems = false;
					$scope.showZapSpot = false;
					$scope.showperimetreUrbain = true;
					$scope.showPistCyclable = true;
					$scope.showSentierPedestre = true;
					$scope.showZoneInondable = true;
					$scope.direction = "up";
					$scope.isOpen = "true";
				};

				$scope.setupScope();

				$scope.showItemsNearMe = function(lat, lng) {
					if ($scope.showItems) {
						$scope.events = null;
					} else {
						var distance = GoogleUtils.getDistanceFromLatLonInMeter($scope.map.getBounds().R.R, $scope.map.getBounds().j.R, $scope.map.getBounds().R.j, $scope.map.getBounds().j.j);
						if (lat) {
							$scope.events = GoogleUtils.getItemListNearMe(lat, lng, distance);
						} else {
							$scope.events = GoogleUtils.getItemListNearMe($scope.lat, $scope.lng, distance);
						}
					}
				};

				$scope.showZap = function() {
					if ($scope.showZapSpot) {
						$scope.zaps = ZapUtils.getZapAccessPoint();
					} else {
						$scope.zaps = null;
					}
				};

				$scope.showPosition = function (position) {
					$scope.lat = position.coords.latitude;
					$scope.lng = position.coords.longitude;
					$scope.accuracy = position.coords.accuracy;
					$scope.$apply();
				};

				$scope.showError = function (error) {
					switch (error.code) {
						case error.PERMISSION_DENIED:
							$scope.error = "User denied the request for Geolocation.";
							break;
						case error.POSITION_UNAVAILABLE:
							$scope.error = "Location information is unavailable.";
							break;
						case error.TIMEOUT:
							$scope.error = "The request to get user location timed out.";
							break;
						case error.UNKNOWN_ERROR:
							$scope.error = "An unknown error occurred.";
							break;
					}
					$scope.$apply();
				};

				$scope.getLocation = function () {
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
					}
					else {
						$scope.error = "Geolocation is not supported by this browser.";
					}
				};

				angular.element($window).bind('resize', function() {
					setTimeout(function(){
						if((window.innerHeight <= 700)  && ($window.innerWidth / $window.innerHeight) > 1) {
							$scope.direction ="right";
						} else {
							$scope.direction = "up";
						}
						$scope.$digest();
					},100)
				});

				NgMap.getMap().then(function(map) {
					$scope.map = map;
					google.maps.event.addListener(map, 'dragend', function() {
						var self = this;
						setTimeout(function() {
							$scope.showItemsNearMe(self.getCenter().lat(), self.getCenter().lng());
							$scope.$digest();
						}, 500);
					});
				});

				$scope.getLocation();
			}]);

})(angular);
