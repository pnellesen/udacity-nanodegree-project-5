//This should hold location information for each marker, in a format compatible with Google Map API
var locationData = [{}];
var LocationModel = function (marker,map) {
	var self = this;
	this.icon = ko.observable(marker.getIcon());
	this.title = ko.observable(marker.getTitle());
	this.lat = ko.observable(marker.getPosition().lat());
	this.lng = ko.observable(marker.getPosition().lng());
	

	this.infoWindow = new google.maps.InfoWindow({
		content:"This is the marker at " + this.lat() + " lat. and " + this.lng() + " long."
	});
	
	console.log("New marker. lat: " + this.lat() + " - long: " + this.lng());
	google.maps.event.addListener(marker, 'click', function(event) {
		console.log("Marker Clicked  at lat/lng: "+ self.lat() + "/" + self.lng());
		self.infoWindow.open(map,marker);
	});
	
	
	
	/* can repostion in this fashion:
	this.lat(this.lat() - 4);
	this.lng(this.lng() - 4);
	marker.setPosition(new google.maps.LatLng(this.lat(),this.lng()));

	console.log("Marker position is now. lat: " + this.lat() + " - long: " + this.lng());
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
	this.map = new google.maps.Map(document.getElementById('mainMap'), this.mapOptions);
	
    google.maps.event.addListener(this.map, 'click', function(event) {
    	console.log("Map Clicked");
    	var marker = new google.maps.Marker({position: event.latLng, map: self.map});
    	self.markerList.push(new LocationModel(marker,self.map));
     });
	/*
	locationData.forEach(function(thisLocation) {
		self.markerList.push(new locationModel(marker));
	})
	*/
	
	
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


