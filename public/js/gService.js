//gService.js

// gService factory - primary means interacting with database
angular.module('gservice', []).factory('gservice', function($rootScope, $http){


        var googleMapService = {};
        var locations = [];

        // initialy set to Galway
        var selectedLat = 53.272;
        var selectedLong = -9.005;


        // Refresh Map using parameters below
        googleMapService.refresh = function(latitude, longitude, filteredResults){

    locations = [];

    selectedLat = latitude;
    selectedLong = longitude;

    if (filteredResults){

        locations = convertToMapPoints(filteredResults); //show points are filtered
        initialize(latitude, longitude, true);
    }

    else {
        // Perform an AJAX call to get all of the records in the db.
        $http.get('/users').success(function(response){

            locations = convertToMapPoints(response);//convert results to points on map
            initialize(latitude, longitude, false);
        }).error(function(){});
    }
};

        // Convert the centres into points on map
        var convertToMapPoints = function(response){

            var locations = []; //initilise array

            // Loop through json entries in response
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // The info window when the map point is clicked on
                var  contentString =
                    '<p><b>Workbench</b>: ' + user.username +
                    '<br><b>Rooms</b>: ' + user.rooms +
                    '<br><a href =' + user.testLink + '>   Book this centre!</a> ' +
                    '</p>';

                // Convert records into Google Maps Location format (Lat, lng)
                locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 350
                    }),
                    username: user.username,
                    rooms: user.rooms,
                    testLink: user.testLink
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

// Initializes the map
var initialize = function(latitude, longitude, filter) {

    var myLatLng = {lat: selectedLat, lng: selectedLong};

    if (!map){ //if there is no map, will create a new map

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,//just covers all of Ireland
            center: myLatLng
        });
    }


    if(filter){ //if the centres on the map are from a search, they will be yellow
        icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    }
    else{ //otherwise use blue marker
        icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }

    // goes through locations and adds marker to map
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: icon,
        });

        google.maps.event.addListener(marker, 'click', function(e){ //listener so marker can be clicked

            //open info window
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // Set initial location
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE, //makes marker bounce
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    map.panTo(new google.maps.LatLng(latitude, longitude));//move to selected location

    // Clicking will move initial marker
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        if(lastMarker){
            lastMarker.setMap(null);
        }

        lastMarker = marker;
        map.panTo(marker.position);

        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });
};

google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
