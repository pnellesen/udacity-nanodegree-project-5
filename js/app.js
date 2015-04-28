//This should hold location information for each marker, in a format compatible with Google Map API
var locationData = [{}];
var LocationModel = function (marker) {
	var self = this;
	this.marker = marker;
	this.icon = ko.observable(marker.getIcon());
	this.title = ko.observable(marker.getTitle());
	this.lat = ko.observable(marker.getPosition().lat());
	this.lng = ko.observable(marker.getPosition().lng());
	this.city = ko.observable('');
	this.state = ko.observable('');
	this.country = ko.observable('');
	this.currentTemp = ko.observable('');
	this.locText = ko.computed(function() {
		return this.city();
	}, this);
	this.radarMap = ko.observable(''); 
	this.windowContent = ko.observable('');// This will be used for filtering
	this.hasOpenWindow = false;// Used to track if InfoWindow is opened at marker. Will allow us to manipulate InfoWindow open/close status during filtering
	this.saveData = ko.computed(function() {
		return {
			lat: this.lat(),
			lng: this.lng(),
			city: this.city(),
			state: this.state(),
			country: this.country(),
			radarSrc: this.radarMap(),
			windowContent: this.windowContent()
		}
	},this);
}

var locationViewModel = function() {
	var self = this;
	this.arrHitTimes = [];
	this.markerList = ko.observableArray([]);
	this.saveAll = ko.observableArray([]);
	this.selectedMarker = ko.observable();
	this.init = function() {
		self.loadMapSrc();
	}
    // Now we can do stuff in the DOM when a marker is selected, just bind to the "selectedMarker"
    this.selectMarker = function(currentMarker) {
    	self.selectedMarker().hasOpenWindow = false;
    	self.mapInfoWindow.close();
    	self.selectedMarker(currentMarker);
    	self.map.setCenter(currentMarker.marker.getPosition());
    	self.getLocationInfo(currentMarker);// Will update window content after ajax call
    };
    this.listChange = function(obj, event) {
    	if (event.originalEvent) {// Only pop info window if changed by user.
    		self.selectMarker(self.selectedMarker());
    	}
    };
    this.saveMarkers = function() {
    	var arrSave = [];
    	for (var i = 0; i < self.markerList().length; i++) {
    		arrSave.push(self.markerList()[i].saveData());
    	}
    	localStorage.setItem('locationInfo',ko.toJSON(arrSave));
    	console.log("Marker info saved to storage " + JSON.parse(localStorage.locationInfo));
    }
    this.loadMarkers = function () {// Load any saved locations and put them on the map
    	if (!localStorage.locationInfo) {
            localStorage.locationInfo = JSON.stringify([]);
        }
    	var storedInfo = JSON.parse(localStorage.locationInfo);
    	for (var i = 0; i < storedInfo.length; i++) {
    		console.log("Getting Location info for: " + storedInfo[i].city);
    		var marker = new google.maps.Marker({position: {lat: storedInfo[i].lat, lng: storedInfo[i].lng}, map: self.map});
    		var location = self.addLocation(marker);
    		location.city(storedInfo[i].city);
    		location.state(storedInfo[i].state);
    		location.country(storedInfo[i].country);
    		location.radarMap(storedInfo[i].radarSrc);
    		location.windowContent(storedInfo[i].windowContent);
    	}
    	
    	
    }
    this.removeMarkers = function() {
    	console.log("Deleting all markers");
    	// This from Google: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    	for (var i = 0; i < self.markerList().length; i++) {
    		self.markerList()[i].marker.setMap(null);
    	}
    	self.markerList([]);
    	localStorage.locationInfo = JSON.stringify([]);
    }
    
    this.removeSelectedMarker = function() {
    	console.log("Removing marker: " + self.selectedMarker().city());
    	self.selectedMarker().marker.setMap(null);
    	self.markerList.remove(self.selectedMarker());
    	
    }
    this.saveSelectedMarker = function() {
    	console.log("Saving marker: " + self.selectedMarker().city() + " - Array index at: " + self.markerList.indexOf(self.selectedMarker()));
    }
    
    // Let's build out a simple filter for the options list here. We don't modify our model, just what appears in the options
    // This technique extrapolated from question found at http://stackoverflow.com/questions/23397975/knockout-live-search
    this.srchTxt = ko.observable('');
    this.clearFilter = function() {
    	self.srchTxt('');
    }
    this.visibleOptions = ko.computed(function() {
         if (self.markerList().length > 0) {//No need to run array filter if we don't have any markers
        	 return ko.utils.arrayFilter(self.markerList(), function(item) {
        		 // Make sure we're only filtering on content, and not markup: item.windowContent().replace(/(<[^>]*>)/g,' ') 
        		 var visible = (item.windowContent().replace(/(<[^>]*>)/g,'').toLowerCase().indexOf(self.srchTxt().toLowerCase()) >= 0);
        		 item.marker.setVisible(visible);// this shows/hides the marker
        		 if (!visible && item.hasOpenWindow) {//Close InfoWindow if opened at marker that will be hidden
        			 item.hasOpenWindow = false;
        			 self.mapInfoWindow.close();
        		 }
        		 return visible;
             });	 
         }
    });
	
	// All the map functions in ViewModel
    this.mapInfoWindow;// Only set up one InfoWindow that will be shared by all markers, per Google documentation
    this.mapErrorTxt = ko.observable('');
    this.mapSrc = ko.observable('');
    this.loadMapSrc = function() {
    	console.log("Fetching map src");
    	try {
    		self.mapSrc('https://maps.googleapis.com/maps/api/js?key=AIzaSyDWLOC6K3kwBnBnp_15oNgkuTjzZ87Fl_I&callback=viewModel.loadMap');	
    	} catch (err) {
    		console.log("error getting src");
    	}
    	
    };
    
    this.loadMap = function() {
    	console.log("loading map");
    	// Add error checking here to insure that "window.google" actually exists - if the src url is malformed or for some reason breaks.
    	try {
    		this.mapOptions = {
    			      center: { lat: -34.397, lng: 150.644},
    			      zoom: 8
  	  		};
  	  	    self.map = new google.maps.Map(document.getElementById('mainMap'), this.mapOptions);
  	  		self.mapInfoWindow = new google.maps.InfoWindow();
  	  		// The following used to bind button click events after infowindow loads:
  	  		// extrapolated from http://techcrawler.riedme.de/2012/09/14/google-maps-infowindow-with-knockout/
	  	  	google.maps.event.addListener(self.mapInfoWindow, 'domready', function() {
	  	  		ko.applyBindings(self, document.getElementById("buttonContainer"));
	  	  	});
  	  		
  	  	    google.maps.event.addListener(self.map, 'click', function(event) {
  	  	    	var marker = new google.maps.Marker({position: event.latLng, map: self.map});
  	  	    	var location = self.addLocation(marker);
  	  	    	self.selectMarker(location);
  	  	     });
  	  	    self.loadMarkers();
    	} catch (err) {
    		alert("We are having trouble loading the map. Please reload the page to try again");// this could be nicer ;)
    		console.log("Error: " + err);    		
    	}

    };
    this.addLocation = function(marker) {
    	var location = new LocationModel(marker);
    	self.markerList.push(location);
    	google.maps.event.addListener(marker, 'click', function(event) {
    		self.selectMarker(location);// This sets the selectedMarker observable to be whichever marker we click on.
    	})
    	return location;
    }
    this.setLocationContent = function(marker) {
    	marker.windowContent(getMarkerContent());
    }

    /* --------
     Let's get simple location info and current weather radar map/ forecast from weather underground api when a marker is selected.
     Map will be centered on the lat/long. received from google map api.
	 Url for single radar image: GET http://api.wunderground.com/api/[key here]/feature/image.format?params
	 ex: GET http://api.wunderground.com/api/d208634303ed569d/feature/image.format?params
	 Note: may want to consider a timer function on this so that we only call it if it's been over some period of time before last pull
	 
	 NOTE: The developer version of this api is limited to 10 calls/minute - putting in a check to enforce it. May be applicable to other apis which practice throttling, or may be useful simply to reduce unneeded calls for slowly updating info
	---------- */
    this.getLocationInfo = function(currentMarker) {
    	
    	/* The following code used to determine if we can make the call to weather underground */
    	var makeCall = false;
    	var now = new Date().getTime();
		if (self.arrHitTimes.length < 10) makeCall = true;
		if ((self.arrHitTimes.length == 10) && (now - self.arrHitTimes[0] > 60000)) {
			/* we've checked the first timestamp in the array and it's ok.
			   Remove it from the array, then add a new timestamp to the end of the array after making the call.
			*/
			makeCall = true;
			self.arrHitTimes.shift();
		}
		/*--- End throttling check --- */

		if (makeCall) {
    		console.log("url: " + "http://api.wunderground.com/api/d208634303ed569d/features/conditions/q/" + currentMarker.lat() + "," + currentMarker.lng() + ".json");
    		$.ajax({
        		  url : "http://api.wunderground.com/api/d208634303ed569d/features/conditions/q/" + currentMarker.lat() + "," + currentMarker.lng() + ".json",
        		  dataType : "jsonp",
        		  success : function(parsed_json) {
        			  if (currentMarker.city() == '') {// No need to update "static" location info every time 
            			  currentMarker.city(parsed_json['current_observation']['display_location']['city']);
            			  currentMarker.state(parsed_json['current_observation']['display_location']['state_name']);
            			  currentMarker.country(parsed_json['current_observation']['display_location']['country_iso3166']);      				  
        			  }
        			  currentMarker.currentTemp(parsed_json['current_observation']['temp_f']);
        		      var radarUrl = "http://api.wunderground.com/api/d208634303ed569d/radar/image.gif?centerlat=" + currentMarker.lat() + "&centerlon=" + currentMarker.lng() + "&radius=100&width=100&height=100&newmaps=1";
        		      currentMarker.radarMap(radarUrl);
        		      self.mapInfoWindow.setContent(getWindowContent());
        		      self.setLocationContent(currentMarker);
        		      self.mapInfoWindow.open(self.map,currentMarker.marker);
        		      currentMarker.hasOpenWindow = true;
        		  },
        		  error: function() {
        			  console.log("Ajax error thrown");
        		  }
            	}).fail(function(jqXHR, textStatus) {
            		console.log("Ajax failed: " + textStatus);
            	});    		
    		    self.arrHitTimes.push(new Date().getTime());
    		    console.log("New timestamp array: " + self.arrHitTimes);
    	} else {
    		// If we've previously pulled info from WU, just use the old info while waiting for refresh
    		if (currentMarker.city() != '') self.mapInfoWindow.open(self.map,currentMarker.marker);
    		console.log("Not making call - too many hits/min: " + (now - self.arrHitTimes[0]) + " - " + self.arrHitTimes);
    	}
    };
};
var viewModel = new locationViewModel();
ko.applyBindings(viewModel);
window.onload = viewModel.init();
console.log("app.js done.");

// DOM manipulation/reading functions here. Call from ViewModel to enforce separation of concerns
function getMarkerContent() {
	return $('.windowContent').html();// Only get marker-specific content.
}
function getWindowContent() {
	return $('.windowContainer').html();// Get the content for the whole window, including buttons
}