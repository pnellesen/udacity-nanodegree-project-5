//This should hold location information for each marker, in a format compatible with Google Map API
var locationData = [{}];
var LocationModel = function (marker) {
	var self = this;
	this.marker = marker;
	this.icon = ko.observable(marker.getIcon());
	this.title = ko.observable(marker.getTitle());
	this.lat = ko.observable(marker.getPosition().lat());
	this.lng = ko.observable(marker.getPosition().lng());
	this.locText = ko.observable("Lat: " + this.lat().toFixed(2) + " - Lng: " + this.lng().toFixed(2));
	this.infoWindow = new google.maps.InfoWindow({
		content:"This is the marker at " + this.locText()
	});

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
    	var location = new LocationModel(marker);
    	self.markerList.push(location);
    	google.maps.event.addListener(marker, 'click', function(event) {
    		self.selectMarker(location);// This sets the selectedMarker observable to be whichever marker we click on.
    	})
     });
    this.selectedMarker = ko.observable();
    
    // Now we can do stuff in the DOM when a marker is selected, just bind to the "selectedMarker"
    this.selectMarker = function(currentMarker) {
    	self.selectedMarker(currentMarker);
    	currentMarker.infoWindow.open(self.map,currentMarker.marker);
    };
    this.listChange = function(obj, event) {
    	if (event.originalEvent) self.selectedMarker().infoWindow.open(self.map,self.selectedMarker().marker);// Only pop info window if changed by user.
    };
    
    // Let's build out a simple filter for the options list here. We don't modify our model, just what appears in the options
    // This technique extrapolated from question found at http://stackoverflow.com/questions/23397975/knockout-live-search
    this.srchTxt = ko.observable('');
    this.visibleOptions = ko.computed(function() {
    	 return ko.utils.arrayFilter(self.markerList(), function(item) {
    		 var visible = (item.locText().toLowerCase().indexOf(self.srchTxt().toLowerCase()) >= 0);
    		 item.marker.setVisible(visible);// this shows/hides the marker
    		 if (!visible) item.infoWindow.close();
    		 return visible;
         });
    });
   
};
var viewModel = new locationViewModel();
ko.applyBindings(viewModel);



(function ($) {// Load map when page loads. 
	console.log("app.js loaded");
	
})(jQuery);


