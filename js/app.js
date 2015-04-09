//This should hold location information for each marker, in a format compatible with Google Map API
var locationData = [{}];
var LocationModel = function (marker,map) {// we use the map for the InfoWindow "open", otherwise wouldn't need it.
	var self = this;
	this.icon = ko.observable(marker.getIcon());
	this.title = ko.observable(marker.getTitle());
	this.lat = ko.observable(marker.getPosition().lat());
	this.lng = ko.observable(marker.getPosition().lng());
	this.locText = ko.observable("Lat: " + this.lat().toFixed(2) + " - Lng: " + this.lng().toFixed(2));
	this.infoWindow = new google.maps.InfoWindow({
		content:"This is the marker at " + this.locText()
	});
	google.maps.event.addListener(marker, 'click', function(event) {
		self.infoWindow.open(map,marker);
	});
	
	
	
	/* can repostion in this fashion:
	this.lat(this.lat() - 4);
	this.lng(this.lng() - 4);
	marker.setlocText(new google.maps.LatLng(this.lat(),this.lng()));

	console.log("Marker locText is now. lat: " + this.lat() + " - long: " + this.lng());
	*/
	
	

	/*  -- copied from CatClicker - KO for reference --
	this.name = ko.observable(catItem.name);
	this.url = ko.observable(catItem.url);
	this.levels= ko.observableArray(["Newborn","Infant","Kitten","Fullgrown"]);
	this.nicknames = ko.observableArray(catItem.nicknames);
	this.clickCount= ko.observable(catItem.clickCount);
	this.level = ko.computed(function() {
		var level;
		if (this.clickCount() < 10) {
			level = this.levels()[0];
		} else if (this.clickCount() < 15) {
			level = this.levels()[1];
		} else if (this.clickCount() < 20) {
			level = this.levels()[2];
		} else {
			level = this.levels()[3];
		}
		return level;
	}, this);
	-- end reference code -- */
}

var locationViewModel = function() {
	var self = this;
	this.markerList = ko.observableArray([]);
	this.mapOptions = {
		      center: { lat: -34.397, lng: 150.644},
		      zoom: 8
	};
	// All the map functions in ViewModel 
	this.map = new google.maps.Map(document.getElementById('mainMap'), this.mapOptions);
    google.maps.event.addListener(this.map, 'click', function(event) {
    	var marker = new google.maps.Marker({position: event.latLng, map: self.map});
    	var location = new LocationModel(marker,self.map);
    	self.markerList.push(location);
    	google.maps.event.addListener(marker, 'click', function(event) {
    		self.selectMarker(location);// This sets the selectedMarker observable to be whichever marker we click on.
    	})
     });
    this.selectedMarker = ko.observable();
    
    // Now we can do stuff in the DOM when a marker is selected, just bind to the "selectedMarker"
    this.selectMarker = function(currentMarker) {
    	self.selectedMarker(currentMarker);
    }
	
	
	/* -- copied from CatClicer - KO for reference --
	var self = this;
	this.catList = ko.observableArray([]);
	catData.forEach(function(thisCat) {
		self.catList.push(new CatModel(thisCat));
	})
	this.currentCat = ko.observable(this.catList()[0]);
	this.incrementCount = function() {
		self.currentCat().clickCount(self.currentCat().clickCount() + 1);
	};
	
	this.selectCat = function(selectedCat) {
		self.currentCat(selectedCat);
	}
	-- end reference code -- */
	
};

ko.applyBindings(new locationViewModel());

(function ($) {// Load map when page loads. 
	console.log("app.js loaded");
	
})(jQuery);


